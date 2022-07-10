import {Ball,Stick,distance,Image2d} from './objects';
import {create,all} from 'mathjs';
import { createElement } from 'react';


const config = {};
const math = create(all,config);

class Engine_2d{
    constructor(){
        this.balls = [];
        this.sticks = [];
        this.images = [];

        this.gravity = true;
    }
    addImage(image,ball1,ball2,ball3,ball4){
        this.images.push(new Image2d(image,ball1,ball2,ball3,ball4));
    }
    setGravity(gravity){
        this.gravity = gravity;
    }
    getBalls(){
        return [...this.balls];
    }
    addBall(x,y,vx=0,vy=0){
        const ball = new Ball(x,y,vx,vy);
        this.balls.push(ball);
        return ball;
    }
    addStick(ball1,ball2){
        const stick = new Stick(ball1,ball2);
        this.sticks.push(stick);
        return stick;
    }
    addCloth(x,y,width,height,nbr_w,nbr_h){
        let matrice = [];
        const stepX = width/(nbr_w-1),
            stepY = height/(nbr_h-1);
        //initialisation de la grille avec les points
        for(let i=0;i<nbr_h;i++){
            let ligne = [];
            for(let j=0;j<nbr_w;j++){
                const ball = new Ball(x+stepX*j,y+stepY*i);
                if(i==0){
                    ball.setFixe(true);
                }
                ligne.push(ball);
                this.balls.push(ball);
            }
            matrice.push(ligne);
        }

        //on relie tous les points
        for(let i=0;i<nbr_h;i++){
            for(let j=0;j<nbr_w;j++){
                const ball1 = matrice[i][j];
                if(i+1!=nbr_h){
                    const ball2 = matrice[i+1][j];
                    const stick = this.addStick(ball1,ball2);
                }
                if(j+1!=nbr_w){
                    const ball3 = matrice[i][j+1];
                    const stick = this.addStick(ball1,ball3);
                }
            }
        }
        return matrice;
    }

    addFlag(image,x,y,width,height,nbr_w,nbr_h){
        let newImage = new Image(width,height);
        newImage.src = image;

        newImage.onload = e=>{
                //matrice de couleur
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(newImage,0,0,width,height);
            const data = ctx.getImageData(0,0,width,height);



            let matrice = [];
            const stepX = width/(nbr_w-1),
                stepY = height/(nbr_h-1);
            //initialisation de la grille avec les points
            for(let i=0;i<nbr_h;i++){
                let ligne = [];
                for(let j=0;j<nbr_w;j++){
                    const ball = new Ball(x+stepX*j,y+stepY*i);
                    if(i==0){
                        ball.setFixe(true);
                    }
                    ligne.push(ball);
                    this.balls.push(ball);
                }
                matrice.push(ligne);
            }

            //on relie tous les points
            let matrice_stick_horizontal = [],
                matrice_stick_vertical = [];
            for(let i=0;i<nbr_h;i++){
                let line_stick_v = [],
                    line_stick_h = [];
                for(let j=0;j<nbr_w;j++){
                    const ball1 = matrice[i][j];
                    if(i+1!=nbr_h){
                        const ball2 = matrice[i+1][j];
                        const stick = this.addStick(ball1,ball2);
                        line_stick_v.push(stick);
                    }
                    if(j+1!=nbr_w){
                        const ball3 = matrice[i][j+1];
                        const stick = this.addStick(ball1,ball3);
                        line_stick_h.push(stick);
                    }
                }
                if(line_stick_h.length!=0){
                    matrice_stick_horizontal.push(line_stick_h);
                }
                if(line_stick_v.length!=0){
                    matrice_stick_vertical.push(line_stick_v);
                }
            }

            //on place les faces
            const lgt_w = (matrice_stick_vertical[0]).length-1,
                lgt_h = matrice_stick_horizontal.length-1;
                console.log(lgt_w,lgt_h);
            for(let i=0;i<lgt_h;i++){
                for(let j=0;j<lgt_w;j++){
                    const stick1 = matrice_stick_horizontal[i][j];
                    const stick3 = matrice_stick_horizontal[i+1][j];
                    const stick4 = matrice_stick_vertical[i][j];
                    const stick2 = matrice_stick_vertical[i][j+1];

                    const x = parseInt(width/lgt_w*(j+0.5)),
                        y = parseInt(height/lgt_h*(i+0.5));
                    const indice = 4*(x+width*y);

                
                    let r=data.data[indice],
                        g=data.data[indice+1],
                        b=data.data[indice+2];
                    const color = 'rgb('+r+','+g+','+b+')';

                    stick1.setColor(color);
                    stick2.setColor(color);
                    stick3.setColor(color);
                    stick4.setColor(color);


                    this.addImage(color,[stick1,stick2,stick3,stick4]);
                }
            }
        }
        

        //return matrice;
    }

    addCube(x,y,width,height,m,v1=[0,0],v2=[0,0],v3=[0,0],v4=[0,0]){
        const [vx1,vy1] = v1;
        const [vx2,vy2] = v2;
        const [vx3,vy3] = v3;
        const [vx4,vy4] = v4;

        const ball1 = this.addBall(x,y,vx1,vy1);
        const ball2 = this.addBall(x+width,y,vx2,vy2);
        const ball3 = this.addBall(x+width,y+height, vx3,vy3);
        const ball4 = this.addBall(x,y+height,vx4,vy4);

        ball1.setMasse(m/4);
        ball2.setMasse(m/4);
        ball3.setMasse(m/4);
        ball4.setMasse(m/4);

        this.addStick(ball1,ball2);
        this.addStick(ball2,ball3);
        this.addStick(ball3,ball4);
        this.addStick(ball4,ball1);
        this.addStick(ball4,ball2);
        this.addStick(ball3,ball1);
        return [ball1,ball2,ball3,ball4];
    }
    addRope(x1,y1,x2,y2,nbr_segment,m=1){
        let liste_points = [];
        const deltaX = x2-x1;
        const deltaY = y2-y1;

        const dist = distance(x1,y1,x2,y2);
        const step = dist/nbr_segment;
        let x = x1,
            y = y1;
        let ball1 = this.addBall(x,y,0,0);
        ball1.setMasse(m/nbr_segment);
        liste_points.push(ball1);
        for(let i=0;i<nbr_segment-1;i++){
            x += deltaX/dist*step;
            y += deltaY/dist*step;

            const ball2 = this.addBall(x,y,0,0);
            ball2.setMasse(m/nbr_segment);
            this.addStick(ball1,ball2);
            liste_points.push(ball2);
            
            ball1 = ball2;
        }
        return liste_points;
    }
    draw(ctx){
        for(let i=0;i<this.balls.length;i++){
            const ball = this.balls[i];
            ball.draw(ctx);
        }
        for(let i=0;i<this.sticks.length;i++){
            const stick = this.sticks[i];
            stick.draw(ctx);
        }
        for(let i=0;i<this.images.length;i++){
            const image = this.images[i];
            image.draw(ctx);
        }
    }
    collision(){
        for(let i=0;i<this.sticks.length;i++){
            for(let j=0;j<this.balls.length;j++){
                const stick = this.sticks[i];
                const ball = this.balls[j];
                let [oldx,oldy] = ball.getOldPos();

                const stickTrajectoire = new Stick(new Ball(oldx,oldy),ball);
                const [isCollision,x,y] = Engine_2d.collisionStick(stick,stickTrajectoire);
                if(isCollision){
                    //console.log(x,y);
                }
            }  
        }
    }
    cutStick(stick1){
        let ltg = this.sticks.length;
        for(let i=0;i<ltg;i++){
            const stick2 = this.sticks[i];
            if(Engine_2d.collisionStick(stick1,stick2)[0]){
                stick2.setDead();
                // this.sticks.splice(i,1);
                // i--;
                // ltg--;
            }
        }
    }
    static collisionStick(stick1,stick2){
        const [ball1,ball2] = stick1.getBalls();
        const [ball3,ball4] = stick2.getBalls();

        const [x1,y1] = ball1.getPos();
        const [x2,y2] = ball2.getPos();
        const [x3,y3] = ball3.getPos();
        const [x4,y4] = ball4.getPos();

        const deltaX1 = x2-x1;
        const deltaY1 = y2-y1;
        const deltaX2 = x3-x4;
        const deltaY2 = y3-y4;

        const M = math.matrix([[deltaX1,-deltaX2],[deltaY1,-deltaY2]]);
        const Y = math.matrix([[x4-x1],[y4-y1]]);
        if(math.det(M)!=0){
            const tM = math.inv(M);
            const A = math.multiply(tM,Y);
            const [i,j] = [A.get([0,0]),A.get([1,0])];
            //point de colision
            let x=deltaX1*i+x1,
                y=deltaY1*i+y1;
            return [(i>0&&i<1&&j>0&&j<1),x,y];
        }else{
            //si pas inversible, c'est qu'il n'ya pas de colision
            return [false,0,0];
        }
    }
    update(){
        for(let i=0;i<this.balls.length;i++){
            const ball = this.balls[i];
            if(this.gravity){
                ball.update(9.8/60);
            }else{
                ball.update();
            }
        }
        for(let j=0;j<1;j++){
            for(let i=0;i<this.sticks.length;i++){
                const stick = this.sticks[i];
                    stick.update();
            }
        }
        for(let i=0;i<this.balls.length;i++){
            const ball = this.balls[i];
            ball.contraint();
        }
    }

};

export default Engine_2d;