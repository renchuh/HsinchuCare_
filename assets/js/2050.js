//Data Source: https://pop-proj.ndc.gov.tw/chart.aspx?c=5&uid=4110&pid=60
let year = [2000, 2005, 2010, 2015, 2020, 2025, 2030, 2035, 2040, 2045, 2050];
let lockedup = [
  1921308, 2216804, 2487893, 2938579, 3787315, 4690875, 5569730, 6253323,
  6703800, 7205193, 7457037,
];

let rate = 200;
let radius = 0.0001;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(150);
  textStyle(NORMAL);

  for (let i = 0; i < year.length; i++) {
    if (frameCount >= rate * i && frameCount < rate + rate * i) {
      noStroke();
      fill(255);
      ellipse(
        windowWidth / 2,
        windowHeight / 2,
        radius * lockedup[i],
        radius * lockedup[i]
      );
      textSize(80);
      fill(200, 50, 50);
      text(year[i], windowWidth / 2, windowHeight / 2 - 20);
      text(nfc(lockedup[i]), windowWidth / 2, windowHeight / 2 + 110);
    } else if (frameCount >= rate + rate * 10) {
      fill(255);
      ellipse(
        windowWidth / 2,
        windowHeight / 2,
        radius * lockedup[10],
        radius * lockedup[10]
      );
      textSize(80);
      fill(200, 50, 50);
      text(year[10], windowWidth / 2, windowHeight / 2 - 20);
      text(nfc(lockedup[10]), windowWidth / 2, windowHeight / 2 + 110);
    }
  }

  textSize(windowWidth / 25);
  textAlign(CENTER);
  fill(0);
  textSize(20);
  text("台灣老年人口數:", windowWidth / 2, windowHeight / 2 + 30);
  text("年份:", windowWidth / 2, windowHeight / 2 - 100);
  textStyle(ITALIC);
  text("資料來源: 國家發展委員會", windowWidth / 2, windowHeight - 20);
}
