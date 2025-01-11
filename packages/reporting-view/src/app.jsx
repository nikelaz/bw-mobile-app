import { useEffect, useState } from 'react';
import { Scale } from '@nikelaz/bw-ui';
import Card from './card';
import ColLayout from './col-layout';

const CategoryType = {
  INCOME: 0,
  EXPENSE: 1,
  SAVINGS: 2,
  DEBT: 3,
};

function App() {
  const [categoryBudgetModel, setCategoryBudgetModel] = useState(window.categoryBudgetModel);
  const [theme, setTheme] = useState(window.theme);
  const [currency, setCurrency] = useState(window.currency);

  useEffect(() => {
    if (document.readyState === "complete") {
      setCategoryBudgetModel(window.categoryBudgetModel);
      setTheme(window.theme);
      setCurrency(window.currency);
      return;
    }

    const loadEventHandler = () => {
      setCategoryBudgetModel(window.categoryBudgetModel);
      setTheme(window.theme);
      setCurrency(window.currency);
    };

    window.addEventListener('load', loadEventHandler);

    return () => {
      window.removeEventListener('load', loadEventHandler);
    }
  }, [setCategoryBudgetModel, setTheme, setCurrency]);

  const incomeCategoryBudgets = categoryBudgetModel.categoryBudgetsByType[CategoryType.INCOME];
  const nonIncomeCategoryBudgets = [
    ...categoryBudgetModel.categoryBudgetsByType[CategoryType.EXPENSE],
    ...categoryBudgetModel.categoryBudgetsByType[CategoryType.SAVINGS],
    ...categoryBudgetModel.categoryBudgetsByType[CategoryType.DEBT],
  ]

  const totalIncome = incomeCategoryBudgets.reduce((accumulator, categoryBudget) => accumulator += categoryBudget.amount, 0);
  const totalPlanned = nonIncomeCategoryBudgets.reduce((accumulator, categoryBudget) => accumulator += categoryBudget.amount, 0);
  const leftToBudget = totalIncome - totalPlanned;
  const leftToBudgetProgress = (totalPlanned / totalIncome) * 100;
  const actual = nonIncomeCategoryBudgets.reduce((accumulator, categoryBudget) => accumulator += categoryBudget.currentAmount, 0);
  const plannedVsActualProgress = (actual / totalIncome) * 100;
  
  return (
    <div className={`wrapper ${theme === 'dark' ? 'theme:dark' : 'theme:light'}`}>
      <ColLayout>
        <Card>
          <Scale
            topValue={totalIncome}
            topLabel="Income"
            unit={currency}
            progress={leftToBudgetProgress}
            leftValue={totalPlanned}
            leftLabel="Planned"
            rightValue={leftToBudget}
            rightLabel="Left to Budget"
          />
        </Card>
        
        <Card>
          <Scale
            topValue={totalIncome}
            topLabel="Planned"
            unit={currency}
            progress={plannedVsActualProgress}
            leftValue={actual}
            leftLabel="Actual"
            rightValue={totalIncome - actual}
            rightLabel="Current Cash"
          />
        </Card>
      </ColLayout>
    </div>
  );
};

export default App;
