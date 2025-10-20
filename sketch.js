/*
By Okazz
*/
let palette = ['#ff4d00', '#2abde4', '#fdb50e', '#2864b8', '#EAEDF1'];
let ctx;
let centerX, centerY;
let motions = [];
let restTime = 300;
let rects = [];

// ⬇️ 2D 模擬翻轉文字相關變數
let rotateAngle = 0; // 旋轉角度
const ROTATE_SPEED = 0.5; // 旋轉速度 (度/幀)
let tamkangText = "淡江大學";
let departmentText = "教育科技學系";
const TEXT_SIZE = 48; // 文字大小為 48px
let textColors; // 用於儲存鮮豔的文字顏色

// ⬇️ 選單相關變數
const MENU_WIDTH = 100;           
const MENU_TEXT_SIZE = 15;        
const HOVER_AREA_WIDTH = 100;     
const MENU_BG_ALPHA = 150;        

let menuItems = ['選單一', '選單二', '選單三'];
let menuCurrentX = -MENU_WIDTH;   
const SLIDE_SPEED = 0.15;         
let isMouseOverMenuArea = false;  

// ⬇️ iFrame 相關變數
let myIframe; // 用於儲存 iFrame 元素
let currentIframeURL = ''; // 追蹤當前 iFrame 載入的 URL

// ⬇️ 網址常數
const URL_MENU_1 = 'https://cfchengit.github.io/20251021_2/';
const URL_MENU_2 = 'https://www.tku.edu.tw';


function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  ctx = drawingContext;
  centerX = width / 2;
  centerY = height / 2;
  tiling();

  // 初始化文字顏色
  textColors = palette.slice();
  shuffle(textColors, true);

  // ⬇️ 創建 iFrame 元素 (初始不設定 src)
  myIframe = createElement('iframe');
  myIframe.style('border', 'none');
  myIframe.style('z-index', '1000'); 
  myIframe.style('position', 'absolute');
  myIframe.hide(); 
  
  // 計算 iFrame 大小和位置
  updateIframePosition();
}

function draw() {
    // 保持背景動畫運行
    background('#21212b');
    for (let i of motions) {
        i.run();
    }

    // -------------------- 繪製 2D 模擬翻轉文字 --------------------
    push();
    
    // 1. 將原點移到畫布中心
    translate(centerX, centerY);

    // 2. 計算模擬翻轉的 X 軸縮放比例 (繞 Y 軸旋轉)
    let flipScale = cos(radians(rotateAngle));
    
    // 3. 判斷文字顏色
    let currentFillColor;
    if (flipScale > 0) {
        currentFillColor = textColors[0];
    } else {
        currentFillColor = textColors[1];
    }
    
    // 4. 應用模擬的 X 軸縮放
    scale(flipScale, 1);
    
    // 設置文字樣式
    fill(currentFillColor);
    textSize(TEXT_SIZE); 
    textAlign(CENTER, CENTER);

    // 繪製兩行文字
    text(tamkangText, 0, -25); 
    text(departmentText, 0, 25); 

    pop(); // 恢復之前的轉換狀態

    // 更新旋轉角度
    rotateAngle = (rotateAngle + ROTATE_SPEED) % 360; 

    // -------------------- 繪製滑動選單 --------------------
    
    // 1. 判斷滑鼠是否在觸發範圍內
    isMouseOverMenuArea = mouseX < HOVER_AREA_WIDTH;
    
    // 2. 確定選單的目標 X 座標
    let menuTargetX;
    if (isMouseOverMenuArea) {
        menuTargetX = 0;
    } else {
        menuTargetX = -MENU_WIDTH;
    }
    
    // 3. 平滑移動選單位置
    menuCurrentX = lerp(menuCurrentX, menuTargetX, SLIDE_SPEED);
    
    // 4. 繪製選單
    if (menuCurrentX > -MENU_WIDTH + 1) { 
        push();
        
        // 繪製半透明白色背景
        fill(255, 255, 255, MENU_BG_ALPHA); 
        noStroke();
        rectMode(CORNER);
        rect(menuCurrentX, 0, MENU_WIDTH, height); 

        // 繪製選單項目
        textSize(MENU_TEXT_SIZE);
        textAlign(LEFT, CENTER);
        
        for (let i = 0; i < menuItems.length; i++) {
            const itemText = menuItems[i];
            const itemX = menuCurrentX + 10; 
            const itemY = 30 + i * 25; 
            
            // 檢查滑鼠懸停 (與 mousePressed 邏輯一致)
            const isHovering = (
                mouseX >= menuCurrentX && 
                mouseX < menuCurrentX + MENU_WIDTH && 
                mouseY >= (itemY - 12.5) && 
                mouseY < (itemY + 12.5) 
            );
            
            if (isHovering) {
                fill(palette[0]); 
            } else {
                fill(0); 
            }
            
            text(itemText, itemX, itemY);
        }
        pop();
    }
}

// ⬇️ 啟動 iFrame 並更新 URL 的輔助函數
function showIframe(url) {
    // 檢查是否要載入不同的 URL
    if (url !== currentIframeURL) {
        myIframe.attribute('src', url);
        currentIframeURL = url;
    }
    
    myIframe.show();
    updateIframePosition(); // 確保位置和大小正確
    noLoop(); // 凍結 p5.js 動畫
}


// ⬇️ 新增滑鼠點擊處理 (Menu Click)
// ⬇️ 新增滑鼠點擊處理 (Menu Click)
function mousePressed() {
    // 檢查滑鼠是否在選單的當前可見區域內
    if (mouseX >= menuCurrentX && mouseX < menuCurrentX + MENU_WIDTH) {
        
        // 選單一的 Y 軸範圍 (索引 0: 30)
        const itemY_1_Min = 30 - 12.5; 
        const itemY_1_Max = 30 + 12.5;

        // 選單二的 Y 軸範圍 (索引 1: 30 + 1*25 = 55)
        const itemY_2_Min = 55 - 12.5; 
        const itemY_2_Max = 55 + 12.5;
        
        // 選單三的 Y 軸範圍 (索引 2: 30 + 2*25 = 80)
        const itemY_3_Min = 80 - 12.5; 
        const itemY_3_Max = 80 + 12.5;

        // 1. 檢查是否點擊了「選單一」
        if (mouseY >= itemY_1_Min && mouseY < itemY_1_Max) {
            showIframe(URL_MENU_1);
            
        // 2. 檢查是否點擊了「選單二」
        } else if (mouseY >= itemY_2_Min && mouseY < itemY_2_Max) {
            showIframe(URL_MENU_2);

        // 3. 檢查是否點擊了「選單三」
        } else if (mouseY >= itemY_3_Min && mouseY < itemY_3_Max) {
            // 點擊「選單三」: 隱藏 iFrame 並恢復動畫
            if (myIframe.elt.style.display !== 'none') {
                myIframe.hide();
                loop(); // 恢復 p5.js 的 draw 循環，繼續背景動畫
            }
        }
    }
}

// ⬇️ 新增 iFrame 尺寸和定位函數
function updateIframePosition() {
    let iframeW = windowWidth * 0.8;
    let iframeH = windowHeight * 0.8;
    let iframeX = (windowWidth - iframeW) / 2;
    let iframeY = (windowHeight - iframeH) / 2;

    myIframe.size(iframeW, iframeH);
    myIframe.position(iframeX, iframeY);
}

// ⬇️ 新增視窗大小改變處理，以保持 iFrame 居中
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    centerX = width / 2;
    centerY = height / 2;
    
    // 如果 iFrame 可見，重新計算其位置和大小
    if (myIframe && myIframe.elt.style.display !== 'none') {
        updateIframePosition();
    }
}

// ⬇️ 新增鍵盤事件處理 (Esc 鍵關閉 iFrame)
function keyPressed() {
  if (keyCode === ESCAPE) {
    if (myIframe.elt.style.display !== 'none') {
      myIframe.hide();
      // 恢復 p5.js 的 draw 循環，繼續背景動畫
      loop(); 
    }
  }
}

// -------------------- 保持原始的 Tiling 和 Motion 類 --------------------

function tiling() {
  let margin = 0;
  let columns = 18;
  let rows = columns;
  let cellW = (width - (margin * 2)) / columns;
  let cellH = (height - (margin * 2)) / rows;
  let emp = columns * rows;
  let grids = [];

  for (let j = 0; j < columns; j++) {
    let arr = []
    for (let i = 0; i < rows; i++) {
      arr[i] = false;
    }
    grids[j] = arr;
  }

  while (emp > 0) {
    let w = random([1, 2]);
    let h = random([1, 2]);
    let x = int(random(columns - w + 1));
    let y = int(random(rows - h + 1));
    let lap = true;
    for (let j = 0; j < h; j++) {
      for (let i = 0; i < w; i++) {
        if (grids[x + i][y + j]) {
          lap = false;
          break;
        }
      }
    }

    if (lap) {
      for (let j = 0; j < h; j++) {
        for (let i = 0; i < w; i++) {
          grids[x + i][y + j] = true;
        }
      }
      let xx = margin + x * cellW;
      let yy = margin + y * cellH;
      let ww = w * cellW;
      let hh = h * cellH;
      rects.push({ x: xx + ww / 2, y: yy + hh / 2, w: ww, h: hh });
      emp -= w * h;
    }
  }

  for (let i = 0; i < rects.length; i++) {
    let r = rects[i];
    if (r.w == r.h) {
      let rnd = int(random(5));

      if (rnd == 0) {
        motions.push(new Motion1_1_01(r.x, r.y, r.w * 0.75));
      } else if (rnd == 1) {
        motions.push(new Motion1_1_02(r.x, r.y, r.w));
      } else if (rnd == 2) {
        motions.push(new Motion1_1_03(r.x, r.y, r.w));
      } else if (rnd == 3) {
        motions.push(new Motion1_1_04(r.x, r.y, r.w));
      } else if (rnd == 4) {
        motions.push(new Motion1_1_05(r.x, r.y, r.w * 0.5));
      }
    } else {
      let rnd = int(random(4));
      if (rnd == 0) {
        motions.push(new Motion2_1_01(r.x, r.y, r.w * 0.9, r.h * 0.9));
      } else if (rnd == 1) {
        motions.push(new Motion2_1_02(r.x, r.y, r.w, r.h));
      } else if (rnd == 2) {
        motions.push(new Motion2_1_03(r.x, r.y, r.w, r.h));
      } else if (rnd == 3) {
        motions.push(new Motion2_1_04(r.x, r.y, r.w, r.h));
      }
    }
  }
}

function easeInOutQuint(x) {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}
class Motion1_1_01 {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;

    this.toggle = int(random(2));
    this.clr = random(palette);
    this.initialize();
    this.duration = 80;
    this.currentW = w;
    this.colors = palette.slice();
    shuffle(this.colors, true);
    this.color1 = color(this.colors[0]);
    this.color2 = color(this.colors[1]);
    this.currentW = this.w;

    if (this.toggle) {
      this.currentColor = this.color1;
      this.corner = this.w;
    } else {
      this.currentColor = this.color2;
      this.corner = 0;
    }
  }

  show() {
    noStroke();
    fill(this.currentColor);
    square(this.x, this.y, this.currentW, this.corner);
  }

  update() {
    if (0 < this.timer && this.timer < this.duration) {
      let nrm = norm(this.timer, 0, this.duration - 1);
      let n = nf(easeInOutQuint(nrm), 0, 4);
      if (this.toggle) {
        this.corner = lerp(this.w, 0, n);
        this.currentColor = lerpColor(this.color1, this.color2, n);
      } else {
        this.corner = lerp(0, this.w, n);
        this.currentColor = lerpColor(this.color2, this.color1, n);
      }
      this.currentW = lerp(this.w, this.w / 2, sin(n * PI));
    }

    if (this.timer > this.duration) {
      if (this.toggle) {
        this.toggle = 0;
      } else {
        this.toggle = 1;
      }
      this.initialize();
    }

    this.timer++;
  }

  initialize() {
    if (this.toggle) {
    } else {
    }
    this.timer = -int(random(restTime));
  }

  run() {
    this.show();
    this.update();
  }
}

class Motion1_1_02 {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.colors = palette.slice();
    shuffle(this.colors, true);
    this.satelliteSize = this.w * 0.2;
    this.orbitW = this.w * 0.4;
    this.orbitH = this.w * 0.1;
    this.timer = int(-random(100));
    this.currentaAngle = random(10);
    this.angleStep = random([1, -1]) * 0.01;
    this.coin = random([-1, 1])
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.currentaAngle);
    noStroke();
    fill(this.colors[0]);
    circle(0, 0, this.w * 0.5);

    fill(this.colors[1]);
    circle(this.orbitW * cos(this.timer / 50 * this.coin), this.orbitH * sin(this.timer / 50 * this.coin), this.satelliteSize);
    pop();
  }

  update() {
    this.timer++;
    this.currentaAngle += this.angleStep;
  }

  run() {
    this.show();
    this.update();
  }
}

class Motion1_1_03 {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;

    this.toggle = int(random(2));
    this.initialize();
    this.duration = 150;
    this.colors = palette.slice();
    shuffle(this.colors, true);



    this.gridCount = 4;
    this.cellW = this.w / this.gridCount;

    this.squareW = 0;
    this.circleD = 0;

    if (this.toggle) {
      this.squareW = this.cellW;
    } else {
      this.circleD = this.cellW * 0.75;
    }
  }

  show() {
    push();
    translate(this.x, this.y);
    noStroke();
    for (let i = 0; i < this.gridCount; i++) {
      for (let j = 0; j < this.gridCount; j++) {
        let cellX = - (this.w / 2) + i * this.cellW + (this.cellW / 2);
        let cellY = - (this.w / 2) + j * this.cellW + (this.cellW / 2);
        if ((i + j) % 2 == 0) {
          fill(this.colors[0]);
          square(cellX, cellY, this.squareW);
        } else {

        }

        fill(this.colors[1]);
        circle(cellX, cellY, this.circleD);
      }
    }
    pop();
  }

  update() {
    if (0 < this.timer && this.timer < this.duration) {
      let nrm = norm(this.timer, 0, this.duration - 1);
      let n = nf(easeInOutQuint(nrm), 0, 4);
      if (this.toggle) {
        this.squareW = lerp(this.cellW, 0, n);
        this.circleD = lerp(0, this.cellW * 0.75, n);

      } else {
        this.squareW = lerp(0, this.cellW, n);

        this.circleD = lerp(this.cellW * 0.75, 0, n);
      }
    }

    if (this.timer > this.duration) {
      if (this.toggle) {
        this.toggle = 0;
      } else {
        this.toggle = 1;
      }
      this.initialize();
    }
    this.timer++;
  }

  initialize() {
    if (this.toggle) {
    } else {
    }
    this.timer = -int(random(restTime));
  }

  run() {
    this.show();
    this.update();
  }
}

class Motion1_1_04 {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;

    this.toggle = int(random(2));
    this.initialize();
    this.duration = 80;
    this.colors = palette.slice();
    shuffle(this.colors, true);

    this.arcD = this.w / 2;
    if (this.toggle) {
      this.shiftX = 0;
      this.shiftY = 0;
      this.arcA = 0;
    } else {
      this.shiftX = this.w / 2;
      this.shiftY = this.w / 2;
      this.arcA = PI;
    }

  }

  show() {
    push();
    translate(this.x, this.y);
    noStroke();
    for (let i = 0; i < 4; i++) {
      push();
      translate(this.shiftX, this.shiftY);
      rotate(this.arcA);
      fill(this.colors[i]);
      arc(0, 0, this.arcD, this.arcD, 0, PI / 2);
      pop();
      rotate(TAU / 4);
    }
    pop();
  }

  update() {
    if (0 < this.timer && this.timer < this.duration) {
      let nrm = norm(this.timer, 0, this.duration - 1);
      let n = nf(easeInOutQuint(nrm), 0, 4);
      if (this.toggle) {
        this.shiftX = lerp(0, this.w / 2, n);
        this.shiftY = lerp(0, this.w / 2, n);
        this.arcA = lerp(0, PI, n);
      } else {
        this.shiftX = lerp(this.w / 2, 0, n);
        this.shiftY = lerp(this.w / 2, 0, n);
        this.arcA = lerp(PI, 0, n);
      }
    }

    if (this.timer > this.duration) {
      if (this.toggle) {
        this.toggle = 0;
      } else {
        this.toggle = 1;
      }
      this.initialize();
    }
    this.timer++;
  }

  initialize() {
    if (this.toggle) {
    } else {
    }
    this.timer = -int(random(restTime));
  }

  run() {
    this.show();
    this.update();
  }
}

class Motion1_1_05 {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;

    this.toggle = int(random(2));
    this.initialize();
    this.duration = 120;
    this.colors = palette.slice();
    shuffle(this.colors, true);
    this.squareW = this.w * 0.4;
    this.counter = 0;
    this.timer++;
  }

  show() {
    push();
    translate(this.x, this.y);
    noStroke();
    fill(this.colors[this.counter % this.colors.length]);
    square(this.w * 0.25, -this.w * 0.25, this.squareW);
    fill(this.colors[(this.counter + 1) % this.colors.length]);
    square(this.w * 0.25, this.w * 0.25, this.squareW);
    fill(this.colors[(this.counter + 2) % this.colors.length]);
    square(-this.w * 0.25, this.w * 0.25, this.squareW);
    fill(this.colors[(this.counter + 3) % this.colors.length]);
    square(-this.w * 0.25, -this.w * 0.25, this.squareW);
    pop();
  }

  update() {
    if (this.timer % 15 == 0) {
      this.counter++
    }
    this.timer++;
  }

  initialize() {
    if (this.toggle) {
    } else {
    }
    this.timer = -int(random(1200));
  }

  run() {
    this.show();
    this.update();
  }
}
class Motion2_1_01 {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.angle = int(random(2)) * PI;
    if (this.w < this.h) {
      this.angle += PI / 2;
    }
    this.minS = min(this.w, this.h);
    this.st = this.minS * 0.15;
    this.color = random(palette);
    this.timer = 0;
    this.speed = 0.025 * random([-1, 1]);
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    noFill();
    stroke(this.color);
    strokeWeight(this.st);
    beginShape();
    let num = 100;
    for (let i = 0; i < num; i++) {
      let theta = map(i, 0, num, 0, PI * 5);
      let r = lerp(0, this.minS * 0.4, sin(map(i, 0, num, 0, PI)));
      let xx = map(i, 0, num - 1, -this.minS, this.minS);
      let yy = r * sin(theta + (this.timer * this.speed));
      vertex(xx, yy);
    }
    endShape();
    pop();
  }

  update() {
    this.timer++;
  }
  run() {
    this.show();
    this.update();
  }
}

class Motion2_1_02 {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.angle = int(random(2)) * PI;
    if (this.w < this.h) {
      this.angle += PI / 2;
    }
    this.minS = min(this.w, this.h);

    this.toggle = int(random(2));
    this.color = random(palette);
    this.initialize();
    this.duration = 120;
    this.targetSize = [];
    this.targetSize[0] = this.minS * 0.5;
    this.targetSize[1] = this.minS * 0.4;
    this.targetSize[2] = this.minS * 0.3;
    this.targetSize[3] = this.minS * 0.2;

    this.circleD = [];
    if (this.toggle) {
      this.circleD[0] = this.targetSize[0];
      this.circleD[1] = this.targetSize[1];
      this.circleD[2] = this.targetSize[2];
      this.circleD[3] = this.targetSize[3];
    } else {
      this.circleD[0] = this.targetSize[3];
      this.circleD[1] = this.targetSize[2];
      this.circleD[2] = this.targetSize[1];
      this.circleD[3] = this.targetSize[0];
    }

  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    noStroke();
    fill(this.color);
    circle(this.minS / 4 * 3, 0, this.circleD[0]);
    circle(this.minS / 4, 0, this.circleD[1]);
    circle(-this.minS / 4, 0, this.circleD[2]);
    circle(-this.minS / 4 * 3, 0, this.circleD[3]);
    pop();
  }

  update() {
    if (0 < this.timer && this.timer < this.duration) {
      let nrm = norm(this.timer, 0, this.duration - 1);
      let n = nf(easeInOutQuint(nrm), 0, 4);
      if (this.toggle) {
        this.circleD[0] = lerp(this.targetSize[0], this.targetSize[3], n);
        this.circleD[1] = lerp(this.targetSize[1], this.targetSize[2], n);
        this.circleD[2] = lerp(this.targetSize[2], this.targetSize[1], n);
        this.circleD[3] = lerp(this.targetSize[3], this.targetSize[0], n);
      } else {
        this.circleD[0] = lerp(this.targetSize[3], this.targetSize[0], n);
        this.circleD[1] = lerp(this.targetSize[2], this.targetSize[1], n);
        this.circleD[2] = lerp(this.targetSize[1], this.targetSize[2], n);
        this.circleD[3] = lerp(this.targetSize[0], this.targetSize[3], n);
      }
    }

    if (this.timer > this.duration) {
      if (this.toggle) {
        this.toggle = 0;
      } else {
        this.toggle = 1;
      }
      this.initialize();
    }

    this.timer++;
  }

  initialize() {
    this.timer = int(-random(restTime));
  }

  run() {
    this.show();
    this.update();
  }
}

class Motion2_1_03 {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.angle = int(random(2)) * PI;
    if (this.w < this.h) {
      this.angle += PI / 2;
    }
    this.minS = min(this.w, this.h);
    this.toggle = int(random(2));
    this.colors = palette.slice();
    shuffle(this.colors, true);
    this.initialize();
    this.duration = 150;
    this.shift = 0;
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    stroke(0);
    strokeWeight(0);
    noFill();
    rect(0, 0, this.minS * 2, this.minS);
    ctx.clip();
    fill(this.colors[1]);

    for (let i = 0; i < 8; i++) {
      let xx = map(i, 0, 8, -this.minS, this.minS * 2.5);
      this.tri(xx - this.shift, 0, this.minS * 0.5);
    }

    pop();
  }

  update() {
    if (0 < this.timer && this.timer < this.duration) {
      let nrm = norm(this.timer, 0, this.duration - 1);
      let n = nf(easeInOutQuint(nrm), 0, 4);
      this.shift = lerp(0, this.minS * 1.3125, n);
      if (this.toggle) {
      } else {
      }
    }

    if (this.timer > this.duration) {
      if (this.toggle) {
        this.toggle = 0;
      } else {
        this.toggle = 1;
      }
      this.initialize();
    }

    this.timer++;
  }

  initialize() {
    this.timer = int(-random(restTime));
  }

  run() {
    this.show();
    this.update();
  }

  tri(x, y, w) {
    beginShape();
    vertex(x, y);
    vertex(x + (w / 2), y - (w / 2));
    vertex(x + (w / 2), y + (w / 2));
    endShape();
  }
}

class Motion2_1_04 {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.angle = int(random(2)) * PI;
    if (this.w < this.h) {
      this.angle += PI / 2;
    }
    this.minS = min(this.w, this.h);
    this.toggle = int(random(2));
    this.colors = palette.slice();
    shuffle(this.colors, true);
    this.initialize();
    this.duration = 30;

    this.circleW = this.minS / 4;
    this.circleH = this.minS / 2;

    if (this.toggle) {
      this.shift = -(this.minS - this.circleW / 2);
    } else {
      this.shift = (this.minS - this.circleW / 2);
    }
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    stroke(0);
    strokeWeight(0);
    fill(this.colors[0]);
    fill(this.colors[1]);
    ellipse(this.shift, 0, this.circleW, this.circleH);

    pop();
  }

  update() {
    if (0 < this.timer && this.timer < this.duration) {
      let nrm = norm(this.timer, 0, this.duration - 1);
      let n = nf(easeInOutQuint(nrm), 0, 4);
      this.circleW = lerp(this.minS / 4, this.minS / 2, sin(n * PI));
      this.circleH = lerp(this.minS / 2, this.minS / 4, sin(n * PI));
      if (this.toggle) {
        this.shift = lerp(-(this.minS - this.circleW / 2), (this.minS - this.circleW / 2), n);
      } else {
        this.shift = lerp((this.minS - this.circleW / 2), -(this.minS - this.circleW / 2), n);
      }

    }

    if (this.timer > this.duration) {
      if (this.toggle) {
        this.toggle = 0;
      } else {
        this.toggle = 1;
      }
      this.initialize();
    }

    this.timer++;
  }

  initialize() {
    this.timer = int(-random(restTime));
  }

  run() {
    this.show();
    this.update();
  }
}
