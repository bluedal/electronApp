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
        const address = await driver.wait(until.elementLocated(By.xpath("//a[@address='서울특별시 은평구 대조동 3-9번지']")), 1000);
        await driver.executeScript('arguments[0].click()', address);

        console.log('=================기본 정보================');

        const basicContainer = await driver.findElement(By.id('basicContainer'));

        // 암묵적 대기
        driver.manage().setTimeouts( { implicit: 1000 } ); 

        const map = await basicContainer.findElement(By.id('map')).findElement(By.tagName('div')).isDisplayed();
        console.log(map + " 맵 보여요.");


        const pano = await basicContainer.findElement(By.id('pano')).findElement(By.tagName('div')).isDisplayed();
        console.log(pano + " 파노라마 맵 보여요.");


        const basicContainerTable = await basicContainer.findElement(By.className('mobileT_layout')).findElements(By.className('data_table_row'));
        
        
        basicContainerTable.forEach((data) => {
                console.log(data.getText());
        });

        const gt_con = await basicContainer.findElement(By.className('gt_con'));

        const homeComBox = await gt_con.findElement(By.name('honame')).isDisplayed();
        console.log(homeComBox + " 호클릭 콤보박스 보여요.");

        // const current = await gt_con.findElements(By.css('.list_s li'));
        // current.forEach((data) => {
        //     console.log(data.getAttribute('textContent'));
        // });

        // 연립다세대 호 버튼 클릭
        const hoSelect = await driver.wait(until.elementLocated(By.xpath("//li[@title='301']")), 10000);
        await driver.executeScript('arguments[0].click()', hoSelect);

        driver.manage().setTimeouts( { implicit: 1000 } ); 

        const hoSiseInfo = await driver.findElement(By.id('hoSiseInfo'));

        const ho_basic_info = await hoSiseInfo.findElement(By.id('ho_basic_info'));
    
        const hoTable1 = await ho_basic_info.findElements(By.className('data_table_row'));
        hoTable1.forEach((data) => {
            console.log(data.getText());
        });


        const extra_tip = await ho_basic_info.findElements(By.className('extra_tip'));
        extra_tip.forEach((data) => {
            console.log(data.getText());
        });

        const abnormalIndicator = await hoSiseInfo.findElement(By.id('abnormalIndicator_info')).isDisplayed();
        console.log(abnormalIndicator  + " 보조지표 출력");

        console.log('========================================');
        console.log('============2년간 시세 추이 시작=============');

        // 최근 2년간 시세 추이
        const hoChart = await hoSiseInfo.findElement(By.id('ho_price_trend_two_years_data'));

        // 차트 표시 확인
        const hoContainer = hoChart.findElement(By.css('.highcharts-container'));
        console.log (hoContainer !== null);

        // 데이터 기준일 확인
        const hoDate = await hoChart.findElement(By.css('.infotip_line>span:last-child')).getText();
        console.log(hoDate);

        console.log('=========================================');
        console.log('===============본건 거래 리스트==============');

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

        console.log('=========================================');
        console.log('================주변 거래 사례==============');


        const nearContainer = await driver.findElement(By.id('nearContainer'));

        const nearMap = await nearContainer.findElement(By.id('nearMap')).findElement(By.tagName('div')).isDisplayed();
        console.log(nearMap + " 맵 표시돼요.");


        const nearDate = await nearContainer.findElement(By.css('.infotip_line>span:last-child')).getText();
        console.log(nearDate);


        
        const nearDealCaseList = await nearContainer.findElement(By.id('nearDealCaseList'));

        const spread_button = nearDealCaseList.findElement(By.className('displayOver880Block')).findElement(By.className('spread_button'));
        await driver.executeScript('arguments[0].click()', spread_button);
    
        const displayOver880Block = await nearDealCaseList.findElement(By.className('displayOver880Block')).findElements(By.className('data_table_row'));
        
        console.log(displayOver880Block.length + " 주변거래사례")
        await displayOver880Block.forEach((text)=>{
            console.log(text.getText());
        });
        

        // 표 클릭
        const dataTableRow = await nearDealCaseList.findElement(By.css('.data_table_row:first-child'));
        await driver.executeScript('arguments[0].click()', dataTableRow);

        // //nearDealCompareLayerWrap
        const nearDealCompare = await driver.findElement(By.id('nearDealCompareLayerWrap'));
            

        // 본건 비교사례 모달창
        const compareItem = await nearDealCompare.findElements(By.className('Compare_item'));
        compareItem.forEach((data)=>{
            console.log(data.getText());
        });

        // 암묵적 대기
        driver.manage().setTimeouts( { implicit: 1000 } ); 

        // 본건 비교사례 모달창 닫기
        const compareClose = await nearDealCompare.findElement(By.className('Compare_close'));
        await driver.executeScript('arguments[0].click()', compareClose);


        // 주변거래사례 표 section
        const unitPriceDistributionWrap = await driver.findElement(By.id('unitPriceDistributionWrap'));

        const privateAreaChart = await unitPriceDistributionWrap.findElement(By.id('privateAreaChart')).findElement(By.tagName('div')).isDisplayed();
        console.log(privateAreaChart + " 전용면적 차트 보여요.");
        
        const useDateChart = await unitPriceDistributionWrap.findElement(By.id('useDateChart')).findElement(By.tagName('div')).isDisplayed();
        console.log(useDateChart + " 연식별 차트 보여요.");
        
        const yearmonChart = await unitPriceDistributionWrap.findElement(By.id('yearmonChart')).findElement(By.tagName('div')).isDisplayed();
        console.log(yearmonChart + " 거래시기별 차트 보여요.");


        const highchartslines = await unitPriceDistributionWrap.findElements(By.className('highcharts-plot-lines-1'));
        console.log(highchartslines.length + " 실선 개수");
        

        const unitPriceWebTable = unitPriceDistributionWrap.findElement(By.className('web_table_display_button'));
        await driver.executeScript('arguments[0].click()', unitPriceWebTable);

        console.log('전용면적 표');
        const privateAreaList = await unitPriceDistributionWrap.findElement(By.id('privateAreaList')).findElements(By.className('data_table_row'));
        await privateAreaList.forEach((data) =>{
            console.log(data.getText());
        });

        console.log('연식별 표');
        const useDateList = await unitPriceDistributionWrap.findElement(By.id('useDateList')).findElements(By.className('data_table_row'));
        await useDateList.forEach((data) =>{
            console.log(data.getText());
        });

        console.log('거래시기별 표');
        const yearmonList = await unitPriceDistributionWrap.findElement(By.id('yearmonList')).findElements(By.className('data_table_row'));
        await yearmonList.forEach((data) =>{
            console.log(data.getText());
        });


        await driver.findElement(By.className('nav3')).click();        

        console.log('=========================================')
        console.log('=============본건 소속 역세권 분석============')

        const stationContainer = await driver.findElement(By.id('stationContainer'));
        const webTable = await stationContainer.findElements(By.css('.data_table_row .data_table_cell'));

        const isElement1 = await webTable[0].findElement(By.tagName('img')).isDisplayed();
        console.log(isElement1 !== false);
        console.log(webTable[1].getText());
        console.log(webTable[2].getText());
        console.log(webTable[3].getText());
        console.log(webTable[4].getText());
        console.log(webTable[5].getText());
        const isElement2 = await webTable[6].findElement(By.tagName('img')).isDisplayed();
        console.log(isElement2 !== false);
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


        await driver.findElement(By.className('nav4')).click();     

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

        
        await driver.findElement(By.className('nav5')).click();     

        console.log('=========================================');
        console.log('==============시세 및 인구 추이==============');

        const populationContainer = await driver.findElement(By.id('populationContainer'));

        const populationWebTable = await populationContainer.findElements(By.className('web_table_display_button'));

        const populationContainerTable = await populationContainer.findElement(By.css('.populationTrend .data_table_row')).findElements(By.className('data_table_cell'));
        populationContainerTable.forEach((data) => {
            console.log(data.getText());
        });
        
        const data_date_box = await populationContainer.findElement(By.css('.populationTrend .data_date_box')).findElements(By.tagName('p'));
        data_date_box.forEach((data) => {
            console.log(data.getText());
        });

        // 최근 2년간 시세 및 거래건수 추이
        const populationContainerDealChart = await populationContainer.findElement(By.id('populationContainerDealChart')).findElement(By.tagName('div')).isDisplayed();
        console.log(populationContainerDealChart + " 차트 보여요.");


        // 표 열기 1
        await driver.executeScript('arguments[0].click()', populationWebTable[0]); 
        

        //최근 2년간 인구 및 세대 추이
        const populationTrendTwoYears = await populationContainer.findElement(By.className('populationTrendTwoYears'))

        const populationTrendTwoYearsChart = await populationTrendTwoYears.findElement(By.id('populationTrendTwoYearsChart')).findElement(By.tagName('div')).isDisplayed();
        console.log(populationTrendTwoYearsChart + " 차트 보여요.");

        const reference_date_for_population = await populationTrendTwoYears.findElement(By.className('reference_date_for_population'));
        console.log(await reference_date_for_population.getText());

        // 표 열기 2
        await driver.executeScript('arguments[0].click()', populationWebTable[1]);         


        //최근 2년간 인구이동 추이
        const transferTrendTwoYears = await populationContainer.findElement(By.className('transferTrendTwoYears'));
        const transferTrendTwoYearsChart = await transferTrendTwoYears.findElement(By.id('transferTrendTwoYearsChart')).findElement(By.tagName('div')).isDisplayed();
        console.log(transferTrendTwoYearsChart + " 차트 보여요.");
        
        const data_record_date = transferTrendTwoYears.findElement(By.className('data_record_date'));
        console.log(await data_record_date.getText());

        // 표 열기 3
        await driver.executeScript('arguments[0].click()', populationWebTable[2]);         



        // 전입 전출지역
        const topTenTransference = await driver.findElement(By.className('topTenTransference'));

        const topTenTransList = await topTenTransference.findElement(By.id('topTenTransList')).findElements(By.className('data_table_row'));
        console.log(topTenTransList.length + " 전입 전출 총 개수");

        await topTenTransList.forEach((data) => {
            console.log(data.getText());
        });

        const infotip_line = await topTenTransference.findElement(By.className('infotip_line')).findElement(By.tagName('span:nth-child(2)'));
        console.log(infotip_line.getText());

        // 모바일용
        // const topTenTransferenceChart = await topTenTransference.findElement(By.id('topTenTransferenceChart')).findElement(By.tagName('div')).isDisplayed();
        // console.log(topTenTransferenceChart + " 차트 보여요.");

        // const topTentransferChart = await topTenTransference.findElement(By.id('topTentransferChart')).findElement(By.tagName('div')).isDisplayed();
        // console.log(topTentransferChart + " 차트 보여요.");
        
        // const infotip_line = await (await topTenTransference.findElement(By.className('infotip_line'))).findElements(By.css('span:nth-child(2)'));
        // console.log(await infotip_line.getText());

    } catch (error) {
        console.log(error)
    } finally {
      //await driver.quit();
    }
  };