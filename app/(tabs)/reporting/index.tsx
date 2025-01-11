import Container from '@/components/container';
import ColLayout from '@/components/col-layout';
import Heading from '@/components/heading';
import { useBudgetModel } from '@/view-models/budget-view-model';
import TouchableBox from '@/components/touchable-box';
import { useRouter } from 'expo-router';
import months from '@/data/months';

export default function Reporting() {
  const router = useRouter();
  const budgetModel = useBudgetModel();
  const currentBudget = budgetModel.currentBudget;

  return (
    <Container>
      <ColLayout>
        <Heading>Reporting</Heading>
      </ColLayout>
      {currentBudget ? (
        <TouchableBox
          icon="calendar-clear"
          arrow={true}
          onPress={() => router.push(`/budget/select-budget?backText=Reporting&backHref=${encodeURIComponent('/(tabs)/reporting')}`)}
        >
          {months[currentBudget.month.getMonth()]} {currentBudget.month.getFullYear()}
        </TouchableBox>
      ) : null}
    </Container>
  );
};
