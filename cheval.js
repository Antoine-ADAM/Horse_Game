let centi=2;
let repere;
let repereBase;
let timeRef1;
let timeRef2;
let timeRef3;
let timeRef4;
let sautCheval;
let marquageCentre;
let obstacles;
let rdb;
let vdb;
let fps;
let distanceTotal=0;
let fontRegular;
let antiDecalage=0;
let sliderCenti;
function preload(){
    //fontRegular=loadFont("/regular.ttf"); //---------------
}
function setup() {
    createCanvas(windowWidth,windowHeight);
    repereBase=createVector(width/4,height/2);
    repere=createVector(width/2-60*centi,height/2-30*centi);
    rdb=createVector(0,0);
    vdb=createVector(0,0);
    //textFont(fontRegular);//-----------------------
    angleMode(DEGREES);
    sliderCenti=createSlider(0.5, 4, 2, 0.1);
    sliderCenti.position(width/2,25);
    sliderCenti.style("width","200px");
}
let cou=300;
let angleTete=45;
let angleQueue=120;
let deca;
let vitesseRoute=0.5;
let perdu=false;
let start=true;
let calculToucheCenti;
function preloadStart(){
    start=false;
    textAlign(LEFT,TOP);
    repere=repereBase.copy();
    sautCheval=createVector(1,0);//x=>hauteur y=>vitesse
    timeRef4=timeRef2=timeRef3=millis();
    marquageCentre=[width];
    obstacles=[];
    rdb=createVector(0,0);
    vdb=createVector(0,0);
}
function mouseMoved() {
    //repere.set(mouseX,mouseY);
}

function draw() {
    centi=sliderCenti.value();
    if(perdu){
        perduF();
        return;
    }
    if(start){
        startF();
        return;
    }
    background("#D9D9D9");
    obstacle();
    route();
    controlCheval();
    cheval();
    infoGame();
}
function perduF(){

}
function startF(){
    background("#D9D9D9");
    cheval();
    textAlign(LEFT,TOP);
    fill("#4F43BF");
    noStroke()
    textSize(20*centi);
    text("Antoine ADAM ©",20,20);
    textAlign(CENTER,CENTER);
    textSize(70*centi);
    text("START",width/2,height/2);
    //rect(width/2-150*centi,height/2-50*centi,300*centi,100*centi);
    
}
function infoGame(){
    noStroke();
    fill("#4F43BF");
    textSize(15);
    textStyle(BOLD);
    if(timeRef4<millis()){
        timeRef4=millis()+500;
        fps=round(frameRate());
    }
    text("FPS:"+fps,20,20);
    text("Score:"+round(distanceTotal/100)+"m",20,40);
    text("Vitesse:"+round(100*vitesseRoute),20,60);
    text("Antoine ADAM ©",20,80);
}
function keyPressed() {
    if (keyCode === 32) {
      if(sautCheval.x==1){
        sautCheval.set(0,-10-15/(vitesseRoute*2));
        timeRef1=millis();  
      }
    }
}

function obstacle(){
    if(timeRef3<millis()){
        timeRef3=millis()+random(1600/(vitesseRoute*2),6000/(vitesseRoute*2));
        obstacles.push(new bariere());
    }
}

function route(){
    const largeur=centi*60;
    const hauteur=centi*5;
    vitesseRoute=1/(1+exp(-(millis()/100000)));
    noStroke();
    fill("#3B403C");
    strokeWeight(2);// 40 103 166
    rect(0,repereBase.y+40*centi,width,126*centi);
    fill("#E6CF25");
    rect(0,repereBase.y+45*centi,width,hauteur);
    rect(0,repereBase.y+156*centi,width,hauteur);
    const positionSolY=repereBase.y+98*centi;
    const deltaDistance=(millis()-timeRef2)*vitesseRoute;
    distanceTotal+=deltaDistance/centi;
    timeRef2=millis();
    if(marquageCentre.length==0)marquageCentre.push(width);
    if(marquageCentre[marquageCentre.length-1]+2*largeur<width){
        marquageCentre.push(marquageCentre[marquageCentre.length-1]+2*largeur);
    }
    for(let i = 0;i<marquageCentre.length;i++){
        marquageCentre[i]-=deltaDistance;
        const marque=marquageCentre[i];
        if(marque+largeur<0){
            marquageCentre.shift();
            i--;
            continue;
        }
        rect(marque,positionSolY,largeur,hauteur);
    }

    for(let i=0;i<obstacles.length;i++){
        const obstacle=obstacles[i];
        obstacle.x-=deltaDistance;
        if(obstacle.x+obstacle.largeur<0){
            obstacles.shift();
            i--;
            continue;
        }
        obstacle.draw();
        if(obstacle.colision())perdu=true;
    }
}
function mouseClicked(){
    if(start && width/2-150*centi<mouseX && height/2-50*centi<mouseY && width/2+150*centi>mouseX && height/2+50*centi>mouseY)preloadStart();
}
function touchStarted() {
    if(touches.length==1){
        if(start && width/2-150*centi<touches[0][0] && height/2-50*centi<touches[0][1] && width/2+150*centi>touches[0][0] && height/2+50*centi>touches[0][1])preloadStart();
        if(touches.length==1 && sautCheval.x==1){
            sautCheval.set(0,-10-15/(vitesseRoute*2));
            timeRef1=millis();
            
        }
    }else if(touches.length==2){
        calculToucheCenti=sqrt(pow(touches[0][0]-touches[1][0],2)+pow(touches[0][1]-touches[1][1],2));
    }
}

function touchMoved(){
    if(touches.length==2)centi+=(sqrt(pow(touches[0][0]-touches[1][0],2)+pow(touches[0][1]-touches[1][1],2))-calculToucheCenti)/500;
}

function controlCheval(){
    if(sautCheval.x!=1){
        if(sautCheval.x>0){
            sautCheval.set(1,0);
            repere.set(repereBase);
            antiDecalage=millis()*0.4*vitesseRoute+90;
        }else{
            sautCheval.add(4.9*pow((millis()-timeRef1)/100,2)+sautCheval.y*(millis()-timeRef1)/100,4.9*(millis()-timeRef1)/100);
            repere.set(repereBase.x,sautCheval.x*centi*4+repereBase.y);
            timeRef1=millis();
        }
    }else{
        repere.set(repereBase);
        const depl=cos(millis()*0.4*vitesseRoute-antiDecalage)*centi*10;
        repere.add(depl,depl);
    }
}

function cheval(){
    //cou=round(millis()*0.01);
    const vitesse=millis()*0.4*vitesseRoute;
    cou=300+cos(vitesse)*15;
    angleQueue=130+cos(vitesse)*30;
    rgaAngle=120+cos(vitesse+15)*30;
    rgbAngle=60+cos(vitesse+15)*90;
    rdaAngle=120+cos(vitesse)*30;
    rdbAngle=60+cos(vitesse)*90;
    vgaAngle=60+cos(vitesse+15)*30;
    vgbAngle=90+cos(vitesse+15)*65;
    vdaAngle=60+cos(vitesse)*30;
    vdbAngle=90+cos(vitesse)*65;
    stroke("#40321C");

    deca=centi*5;
    strokeWeight(centi*5);
    line(repere.x+deca,repere.y+deca,repere.x+cos(angleQueue)*40*centi,repere.y+sin(angleQueue)*40*centi);
    
    deca=centi*14;
    //rd
    const rda=createVector(30*centi*cos(rdaAngle)+10*centi+repere.x,30*centi*sin(rdaAngle)+repere.y+40*centi);
    rdb.set(35*cos(rdbAngle)*centi+rda.x,35*sin(rdbAngle)*centi+rda.y);
    strokeWeight(deca);
    stroke("#7A6447");
    line(10*centi+repere.x,repere.y+40*centi,rda.x,rda.y);
    strokeWeight(centi*6);
    line(rda.x,rda.y,rdb.x,rdb.y);
    stroke("#423626");
    point(rdb.x,rdb.y);
    //rg
    const rga=createVector(30*centi*cos(rgaAngle)+10*centi+repere.x,30*centi*sin(rgaAngle)+repere.y+40*centi);
    const rgb=createVector(35*cos(rgbAngle)*centi+rga.x,35*sin(rgbAngle)*centi+rga.y);
    strokeWeight(deca);
    stroke("#7A6036");
    line(10*centi+repere.x,repere.y+40*centi,rga.x,rga.y);
    strokeWeight(centi*6);
    line(rga.x,rga.y,rgb.x,rgb.y);
    stroke("#40321C");
    point(rgb.x,rgb.y);
    //vd
    const vda=createVector(30*centi*cos(vdaAngle)+110*centi+repere.x,30*centi*sin(vdaAngle)+repere.y+40*centi);
    vdb.set(35*cos(vdbAngle)*centi+vda.x,35*sin(vdbAngle)*centi+vda.y);
    strokeWeight(deca);
    stroke("#7A6447");
    line(110*centi+repere.x,repere.y+40*centi,vda.x,vda.y);
    strokeWeight(centi*6);
    line(vda.x,vda.y,vdb.x,vdb.y);
    stroke("#423626");
    point(vdb.x,vdb.y);
    //vg
    const vga=createVector(30*centi*cos(vgaAngle)+110*centi+repere.x,30*centi*sin(vgaAngle)+repere.y+40*centi);
    const vgb=createVector(35*cos(vgbAngle)*centi+vga.x,35*sin(vgbAngle)*centi+vga.y);
    strokeWeight(deca);
    stroke("#7A6036");
    line(110*centi+repere.x,repere.y+40*centi,vga.x,vga.y);
    strokeWeight(centi*6);
    line(vga.x,vga.y,vgb.x,vgb.y);
    stroke("#40321C");
    point(vgb.x,vgb.y);

    fill("#7A6036");
    noStroke();
    rect(repere.x,repere.y,120*centi,40*centi,20);
    
    strokeWeight(centi*16);
    stroke("#7A6036");
    deca=centi*12;
    const tete=createVector(repere.x+120*centi+centi*40*cos(cou),40*sin(cou)*centi+repere.y);
    const teteb=createVector(tete.x+30*centi*cos(angleTete),tete.y+30*centi*sin(angleTete));
    line(repere.x+120*centi-deca,repere.y+deca,tete.x,tete.y);
    stroke("#7F6342");
    line(tete.x,tete.y,teteb.x,teteb.y);
    
    //point(tete.x,tete.y);
    
}
class bariere{
        constructor(){
            this.largeur=25*centi;
            this.hauteur=40*centi;
            this.x=width+this.largeur;
            this.y=repereBase.y+(103+random(-15,15))*centi;
        }
        draw(){
            fill("#A68446")
            //rect(this.x,this.y,this.largeur,-this.hauteur);
            rect(this.x+1,this.y-7.5*centi,this.largeur-2,-5*centi);
            rect(this.x+1,this.y-27.5*centi,this.largeur-2,-5*centi);
            fill("#BF984E")
            rect(this.x,this.y-this.hauteur,5*centi,this.hauteur,2.5*centi,2.5*centi,0,0);
            rect(this.x+10*centi,this.y-this.hauteur,5*centi,this.hauteur,2.5*centi,2.5*centi,0,0);
            rect(this.x+20*centi,this.y-this.hauteur,5*centi,this.hauteur,2.5*centi,2.5*centi,0,0);
        }
        colision(){
            if(vdb.x>this.x && rdb.x<this.x+this.largeur)
                if((vdb.x<this.x+this.largeur && vdb.y>this.y-this.hauteur) || (rdb.x>this.x && rdb.y>this.y-this.hauteur))return true;
            return false; 
        }
}