const {Builder, By, Key, until} = require('selenium-webdriver')
const fs = require('fs');

/* URL 및 계정 정보 */
// const devAccount = fs.readFileSync('public/js/account_dev.json');
// const realAccount = fs.readFileSync('public/js/account_real.json');
// const jsonParse = devAccount.toString();
// console.log(jsonParse);

window.$ = window.jQuery = require('./public/js/jquery-3.5.1.min.js')

let targetUrl;
document.body.addEventListener('click', (event) => {

    if (event.target.classList.contains('btn-real')) {
        targetUrl = "http://villasise.com";
        document.querySelector('.container').classList.add('is-show')
        document.querySelector('.menu-nav').classList.add('is-hiding')

    } else if(event.target.classList.contains('btn-dev')) {
        targetUrl = "http://dev.villasise.com";
        document.querySelector('.container').classList.add('is-show')
        document.querySelector('.menu-nav').classList.add('is-hiding')

    } else if(event.target.classList.contains('btn-back')) {
        
        document.querySelector('.container').classList.remove('is-show')
        document.querySelector('.menu-nav').classList.remove('is-hiding')
    } else if(event.target.classList.contains('btn-check')) {
        example(targetUrl);
    }
});

async function example(targetUrl) {
    let driver = await  new Builder().forBrowser('chrome').build();
    try {
      
        await driver.get(targetUrl);

        // 로그인버튼 클릭
        await driver.findElement(By.linkText('로그인 및 회원가입')).click();

        // 회원정보 입력
        await driver.findElement(By.name('username')).sendKeys('test01');
        await driver.findElement(By.name('password')).sendKeys('test01', Key.RETURN);

        // 주소 입력 후 해동 주소 클릭
        await driver.findElement(By.xpath("//input[@title='검색어 입력']")).sendKeys("대조동");
        const address = await driver.wait(until.elementLocated(By.xpath("//a[@address='서울특별시 은평구 대조동 3-9번지']")), 10000);
        await driver.executeScript('arguments[0].click()', address);

        // 연립다세대 호 버튼 클릭
        const hoSelect = await driver.wait(until.elementLocated(By.xpath("//li[@title='301']")), 10000);
        await driver.executeScript('arguments[0].click()', hoSelect);

        const averSise = await driver.wait(until.elementLocated(By.className('aver_sise')), 10000, 'Timed out after 30 seconds', 1000).getText();
        console.log(averSise);

        const averSisePerArea = await driver.findElement(By.className('aver_sise_per_area')).getText();
        console.log(averSisePerArea);

        const referenceDateForSise = await driver.findElement(By.className('reference_date_for_sise')).getText();
        console.log(referenceDateForSise + ' 날짜');
        
        const averSisePerAreaS = await driver.findElement(By.className('disable')).getText();
        console.log(averSisePerArea.length);

        console.log('============2년간 시세 추이 시작=============')

        // 최근 2년간 시세 추이
        const hoChart = await driver.findElement(By.id('ho_price_trend_two_years_data'));

        // 차트 표시 확인
        const hoContainer = hoChart.findElement(By.css('.highcharts-container'));
        console.log (hoContainer !== null);

        // 데이터 기준일 확인
        const hoDate = await hoChart.findElement(By.css('.infotip_line>span:last-child')).getText();
        console.log(hoDate);

        console.log('=========================================')
        console.log('===============본건 거래 리스트==============')

        const mainChart = await driver.findElement(By.id('main_deal_trend_five_years_data'));

        const mainContainer = mainChart.findElement(By.css('.highcharts-container'));
        console.log (mainContainer !== null);

        const mainDate = await mainChart.findElement(By.css('.infotip_line>span:last-child')).getText();
        console.log(mainDate);

        const mainTable = await mainChart.findElement(By.className('table_display_button'));
        await driver.executeScript('arguments[0].click()', mainTable);

        const tableCell = await mainChart.findElements(By.className('data_table_cell'));
        tableCell.forEach((text)=>{
            if(text.getAttribute('textContent') === ""){
                console.log('값 없음');
            } else {
                console.log('값 있음');
            }
        });

        await driver.findElement(By.className('nav2')).click();        

        console.log('=========================================')
        console.log('================주변 거래 사례==============')


        const nearContainer = await driver.findElement(By.id('nearContainer'));


        const nearDate = await nearContainer.findElement(By.css('.infotip_line>span:last-child')).getText();
        console.log(nearDate);

        const nearDealCaseList = nearContainer.findElement(By.id('nearDealCaseList'));
        const nearTableCell = await nearDealCaseList.findElements(By.css('.data_table_cell'));
        nearTableCell.forEach((text)=>{
            if(text.getAttribute('textContent') === ""){
                console.log('값 없음');
            } else {
                console.log('값 있음');
            }
        });
        
        const dataTableRow = nearDealCaseList.findElement(By.css('.data_table_row:first-child'));
        await driver.executeScript('arguments[0].click()', dataTableRow);

        //nearDealCompareLayerWrap
        const nearDealCompare = await driver.findElement(By.id('nearDealCompareLayerWrap'));
        let compareItem;
            if(nearDealCompare.isDisplayed()){
                let compareItem = await nearDealCompare.findElements(By.className('Compare_item'));
                compareItem.forEach((text)=>{
                    if(text.getAttribute('textContent') === ""){
                        console.log('값 없음');
                    } else {
                        console.log('값 있음');
                    }
                });
            }

        const compareClose = await nearDealCompare.findElement(By.className('Compare_close'));
        await driver.executeScript('arguments[0].click()', compareClose);

        const unitPriceDistributionWrap = await driver.findElement(By.id('unitPriceDistributionWrap'));
        const test = await unitPriceDistributionWrap.findElements(By.className('highcharts-plot-lines-1'));
        console.log( test == 6);
        test.forEach((text)=>{
            if(text.isDisplayed()){
                console.log('표시됨');
            } else {
                console.log('표시안됨');
            }
        });
        
        await driver.findElement(By.className('nav3')).click();        

        console.log('=========================================')
        console.log('=============본건 소속 역세권 분석============')

        const stationContainer = await driver.findElement(By.id('stationContainer'));
        const webTable = await stationContainer.findElements(By.css('.data_table_row .data_table_cell'));

        const isElement = await webTable[0].findElement(By.tagName('img')).isDisplayed();
        console.log(isElement !== false);
        console.log(webTable[1].getText() !== "");
        console.log(webTable[2].getText() !== "");
        console.log(webTable[3].getText() !== "");
        console.log(webTable[4].getText() !== "");
        console.log(webTable[5].getText() !== "");
        console.log(webTable[6].getText());
        console.log(webTable[7].getText());
        console.log(webTable[8].getText());
        console.log(webTable[9].getText());
        console.log(webTable[10].getText());
        console.log(webTable[11].getText());
        
        const stationMap = await stationContainer.findElement(By.id('stationMap')).findElement(By.tagName('div')).isDisplayed();
        console.log(stationMap + "  맵 보여요.");

        const stationContainerDealChart = await stationContainer.findElement(By.id('stationContainerDealChart')).findElement(By.tagName('div')).isDisplayed();
        console.log(stationContainerDealChart + "  차트 보여요.");

        const stationContainerDealChartDate = await stationContainer.findElement(By.css('.infotip_line>span:last-child')).getText();
        console.log(stationContainerDealChartDate);

        const stationBuildyearChart = await stationContainer.findElement(By.id('stationBuildyearChart')).findElement(By.tagName('div')).isDisplayed();
        console.log(stationContainerDealChart + "  차트 보여요.");
        
        const stationPrivateAreaChart = await stationContainer.findElement(By.id('stationPrivateAreaChart')).findElement(By.tagName('div')).isDisplayed();
        console.log(stationPrivateAreaChart + "  차트 보여요.");


        console.log('=========================================');
        console.log('===============지역별 시세조회===============');

        const localContainer = await driver.findElement(By.id('localContainer'));

        const islocalMap = await localContainer.findElement(By.id('localMap')).findElement(By.tagName('div')).isDisplayed();
        console.log(islocalMap + " 맵 보여요.");

        const localContainerDealChart = await localContainer.findElement(By.id('localContainerDealChart')).findElement(By.tagName('div')).isDisplayed();
        console.log(localContainerDealChart + " 차트 보여요.");

        const displayButton = await localContainer.findElement(By.className('web_table_display_button'));
        await driver.executeScript('arguments[0].click()', displayButton);

        const localBuildyearChart = await localContainer.findElement(By.id('localBuildyearChart')).findElement(By.tagName('div')).isDisplayed();
        console.log(localBuildyearChart + " 차트 보여요.");
        
        const localPrivateAreaChart = await localContainer.findElement(By.id('localPrivateAreaChart')).findElement(By.tagName('div')).isDisplayed();
        console.log(localPrivateAreaChart + " 차트 보여요.");

        
        console.log('=========================================');
        console.log('==============시세 및 인구 추이==============');

        const populationContainer = await driver.findElement(By.id('populationContainer'));

        const populationContainerTable = await populationContainer.findElement(By.css('.populationTrend .data_table_row')).findElements(By.className('data_table_cell'));
        populationContainerTable.forEach((data) => {
            console.log(data.getText());
        });
        
        const data_date_box = await populationContainer.findElement(By.css('.populationTrend .data_date_box')).findElements(By.tagName('p'));
        data_date_box.forEach((data) => {
            console.log(data.getText());
        });

        const populationContainerDealChart = await localContainer.findElement(By.id('populationContainerDealChart')).findElement(By.tagName('div')).isDisplayed();
        console.log(populationContainerDealChart + " 차트 보여요.");
        

        // 표보기1

        const populationTrendTwoYears = await populationContainer.findElement(By.className('.populationTrendTwoYears'))

        const populationTrendTwoYearsChart = await populationTrendTwoYears.findElement(By.id('populationTrendTwoYearsChart')).findElement(By.tagName('div')).isDisplayed();
        console.log(populationTrendTwoYearsChart);

        const reference_date_for_population = await populationTrendTwoYears.findElement(By.className('reference_date_for_population'));
        console.log(reference_date_for_population);

        
        

    } catch (error) {
        console.log(error)
    } finally {
      //await driver.quit();
    }
  };