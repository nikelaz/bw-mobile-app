import ColLayout from '@/src/components/col-layout';
import Heading from '@/src/components/heading';
import { useStore } from '@/src/stores/store';
import TouchableBox from '@/src/components/touchable-box';
import { useRouter } from 'expo-router';
import months from '@/data/months';
import { WebView } from 'react-native-webview';
import { html as encodedHtml } from '@nikelaz/bw-reporting-view/dist/index';
import { useColorScheme, Dimensions, View } from 'react-native';
import { useState, useRef, useEffect, useMemo } from 'react';
import { LoadingLine } from '@/src/components/loading-line';
import Container from '@/src/components/container';
const html = decodeURIComponent(encodedHtml);

export default function Reporting() {
  const router = useRouter();
  const currentBudget = useStore(state => state.currentBudget);
  const categoryBudgetsByType = useStore(state => state.categoryBudgetsByType);
  const getCurrency = useStore(state => state.getCurrency);
  const currency = useStore(state => state.currency);
  const theme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const webViewRef = useRef<WebView | null>(null);
  const screenDimensions = Dimensions.get('screen');
  const [height, setHeight] = useState(Math.round(screenDimensions.width * 3.41));

  const runFirst = useMemo(() => `
    window.categoryBudgetsByType = ${JSON.stringify(categoryBudgetsByType)};
    window.theme = '${theme}';
    window.currency = '${getCurrency()}';
    window.dispatchEvent(new Event('load'));
  `, [categoryBudgetsByType, currency, theme, isLoading]);

  useEffect(() => {
    if (webViewRef.current && !isLoading) {
      webViewRef.current.injectJavaScript(runFirst);
    }
  }, [runFirst]);

  return (
    <Container topInset={true}>
      <ColLayout>
        <Heading>Reporting</Heading>

        {currentBudget && !isLoading ? (
          <TouchableBox
            icon="calendar-outline"
            arrow={true}
            onPress={() => router.navigate('/(tabs)/reporting/select-budget')}
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
