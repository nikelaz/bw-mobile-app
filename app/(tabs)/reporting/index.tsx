import Container from '@/components/container';
import ColLayout from '@/components/col-layout';
import Heading from '@/components/heading';
import { useBudgetModel } from '@/view-models/budget-view-model';
import TouchableBox from '@/components/touchable-box';
import { useRouter } from 'expo-router';
import months from '@/data/months';
import { WebView } from 'react-native-webview';
import { html as encodedHtml } from '@/packages/reporting-view/dist/index';
import { useColorScheme } from 'react-native';
import { useCategoryBudgetModel } from '@/view-models/category-budget-view-model';
import { useUserModel } from '@/view-models/user-view-model';
const html = decodeURIComponent(encodedHtml);

export default function Reporting() {
  const router = useRouter();
  const budgetModel = useBudgetModel();
  const categoryBudgetModel = useCategoryBudgetModel();
  const userModel = useUserModel();
  const currentBudget = budgetModel.currentBudget;
  const theme = useColorScheme();

  const runFirst = `
    window.categoryBudgetModel = ${JSON.stringify(categoryBudgetModel)};
    window.theme = '${theme}';
    window.currency = '${userModel.getCurrency()}';
  `;

  return (
    <Container>
      <ColLayout>
        <Heading>Reporting</Heading>

        {currentBudget ? (
          <TouchableBox
            icon="calendar-clear"
            arrow={true}
            onPress={() => router.push(`/budget/select-budget?backText=Reporting&backHref=${encodeURIComponent('/(tabs)/reporting')}`)}
          >
            {months[currentBudget.month.getMonth()]} {currentBudget.month.getFullYear()}
          </TouchableBox>
        ) : null}

        <WebView
          source={{ html }}
          style={{ flex: 1, height: 500 }}
          injectedJavaScriptBeforeContentLoaded={runFirst}
        />
      </ColLayout>
      
    </Container>
  );
};
