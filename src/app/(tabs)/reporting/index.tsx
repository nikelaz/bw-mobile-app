import ColLayout from '@/src/components/col-layout';
import Heading from '@/src/components/heading';
import { useBudgetStore } from '@/src/view-models/budget-view-model';
import TouchableBox from '@/src/components/touchable-box';
import { useRouter } from 'expo-router';
import months from '@/data/months';
import { WebView } from 'react-native-webview';
import { html as encodedHtml } from '@nikelaz/bw-reporting-view/dist/index';
import { useColorScheme, Dimensions, View } from 'react-native';
import { useCategoryBudgetModel } from '@/src/view-models/category-budget-view-model';
import { useUserModel } from '@/src/view-models/user-view-model';
import { useState, useRef, MutableRefObject, useEffect } from 'react';
import { LoadingLine } from '@/src/components/loading-line';
import Container from '@/src/components/container';
const html = decodeURIComponent(encodedHtml);

export default function Reporting() {
  const router = useRouter();
  const budgetStore = useBudgetStore();
  const categoryBudgetModel = useCategoryBudgetModel();
  const userModel = useUserModel();
  const currentBudget = budgetStore.currentBudget;
  const theme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const webViewRef: MutableRefObject<WebView | null> = useRef(null);
  const screenDimensions = Dimensions.get('screen');
  const [height, setHeight] = useState(Math.round(screenDimensions.width * 3.41));

  const runFirst = `
    window.categoryBudgetModel = ${JSON.stringify(categoryBudgetModel)};
    window.theme = '${theme}';
    window.currency = '${userModel.getCurrency()}';
    window.dispatchEvent(new Event('load'));
  `;

  useEffect(() => {
    if (webViewRef.current && !isLoading) {
      webViewRef.current.injectJavaScript(runFirst);
    }
  }, [budgetStore.currentBudget, userModel, isLoading, runFirst]);

  return (
    <Container>
      <ColLayout>
        <Heading>Reporting</Heading>

        {currentBudget && !isLoading ? (
          <TouchableBox
            icon="calendar-outline"
            arrow={true}
            onPress={() => router.navigate(`/budget/select-budget?backText=Reporting&backHref=${encodeURIComponent('/(tabs)/reporting')}`)}
          >
            {months[currentBudget.month.getMonth()]} {currentBudget.month.getFullYear()}
          </TouchableBox>
        ) : (
          <LoadingLine height={47} />
        )}

        <View style={{ position: 'relative' }}>
          <WebView
            ref={webViewRef}
            source={{ html }}
            style={{ flex: 1, height: height, backgroundColor: 'transparent', overflow: 'hidden' }}
            onLoad={() => setIsLoading(false)}
            injectedJavaScriptBeforeContentLoaded={runFirst}
            scalesPageToFit={true}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            overScrollMode='never'
            onMessage={(event) => {
              if (event.nativeEvent && event.nativeEvent.data) {
                try {
                  const data = JSON.parse(event.nativeEvent.data);
                  if (data.height) setHeight(Math.round(parseFloat(data.height)) + 1);
                } catch {}
              }
            }}
          />
          { isLoading ? (
            <View style={{position: 'absolute', width: '100%'}}>
              <ColLayout>
                <LoadingLine height={162} />
                <LoadingLine height={162} />
                <LoadingLine height={276} />
              </ColLayout>
            </View>
          ) : null}
        </View>
        
      </ColLayout>
    </Container>
  );
};
