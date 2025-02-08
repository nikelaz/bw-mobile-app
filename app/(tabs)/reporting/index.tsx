import Container from '@/components/container';
import ColLayout from '@/components/col-layout';
import Heading from '@/components/heading';
import { useBudgetModel } from '@/view-models/budget-view-model';
import TouchableBox from '@/components/touchable-box';
import { useRouter } from 'expo-router';
import months from '@/data/months';
import { WebView } from 'react-native-webview';
import { html as encodedHtml } from '@nikelaz/bw-reporting-view/dist/index';
import { useColorScheme, Dimensions } from 'react-native';
import { useCategoryBudgetModel } from '@/view-models/category-budget-view-model';
import { useUserModel } from '@/view-models/user-view-model';
import { useState, useRef, MutableRefObject, useEffect } from 'react';
import { View } from 'react-native';
import { LoadingLine } from '@/components/loading-line';
const html = decodeURIComponent(encodedHtml);

export default function Reporting() {
  const router = useRouter();
  const budgetModel = useBudgetModel();
  const categoryBudgetModel = useCategoryBudgetModel();
  const userModel = useUserModel();
  const currentBudget = budgetModel.currentBudget;
  const theme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const webViewRef: MutableRefObject<WebView | null> = useRef(null);
  const screenDimensions = Dimensions.get('screen');
  const [height, setHeight] = useState(screenDimensions.width * 3.41);

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
  }, [budgetModel.currentBudget, userModel, webViewRef.current]);

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
            style={{ flex: 1, height: height, backgroundColor: 'transparent', outline: '1px solid', outlineColor: '#fff', overflow: 'hidden' }}
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
                  if (data.height) setHeight(parseInt(data.height) + 1);
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
