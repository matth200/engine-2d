import { createPortal } from "react-dom";

class Ball{
    constructor(x,y,vx=0,vy=0){
        this.x = x;
        this.y = y;

        this.m = 1;

        this.oldx = x-vx;
        this.oldy = y-vy;

        this.width = null;
        this.height = null;

        this.fixe = false;

        this.friction = 0.999;
        this.rebound = 0.7;
    }

    setMasse(m){
        this.m = m;
    }
    getMasse(){
        return this.m;
    }
    setFixe(fixe){
        this.fixe = fixe;
    }

    update(gravity=0){
        if(!this.fixe){
            let vx = this.x-this.oldx,
            vy = this.y-this.oldy;  

            vy += gravity;
            this.oldx = this.x;
            this.oldy = this.y;
            
            this.x += vx*this.friction;
            this.y += vy*this.friction;
        }
    }
    draw(ctx){
        if(this.width==null || this.height==null){
            this.width = ctx.canvas.width;
            this.height = ctx.canvas.height;
        }
        ctx.fillStyle = '#FFFFFF'
        ctx.beginPath()
        //ctx.arc(this.x, this.y, 3, 0, 2*Math.PI)
        ctx.fill()
    }
    contraint(){
        if(!(this.width==null || this.height==null)){
            //il y a eu une colision
            if(this.x<0||this.x>this.width||this.y<0||this.y>this.height){
                let vx = this.x-this.oldx,
                    vy = this.y-this.oldy;
                
                if(this.x<0||this.x>this.width){
                    vx = -vx;
                }
                if(this.y<0|| this.y>this.height){
                    vy = -vy;
                }
                
                //on rectifie
                this.x = (this.x<0)?0:this.x;
                this.x = (this.x>this.width)?this.width:this.x;
        
                this.y = (this.y<0)?0:this.y;
                this.y = (this.y>this.height)?this.height:this.y;

                this.oldx = this.x-vx*this.rebound; 
                this.oldy = this.y-vy*this.rebound;
            }
        }
    }
    getFixe(){
        return this.fixe;
    }
    setSpeed(vx,vy){
        this.oldx = this.x-vx;
        this.oldy = this.y-vy;
    }
    setPos(x,y){
        this.x = x;
        this.y = y;
    }
    getOldPos(){
        return [this.oldx,this.oldy];
    }
    getPos(){
        return [this.x,this.y];
    }
}

const distance = (x1,y1,x2,y2) => {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    return Math.sqrt(deltaX*deltaX + deltaY*deltaY);
};

class Stick{
    constructor(ball1,ball2){
        this.ball1 = ball1;
        this.ball2 = ball2;

        const [x1,y1] = ball1.getPos();
        const [x2,y2] = ball2.getPos();

        this.l = distance(x1,y1,x2,y2);
        this.affichage = true;

        this.color = "#ffffff";
        this.max_l = 0;
        this.alive = true;
    }
    setDead(){
        this.alive = false;
    }
    setColor(color){
        this.color = color;
    }
    setAffichage(r){
        this.affichage=r;
    }
    isAlive(){
        return this.alive;
    }

    getBalls(){
        return [this.ball1,this.ball2];
    }

    setMaxLongueur(l){
        this.max_l = l;
    }

    update(){
        if(this.alive){
            let [x1,y1] = this.ball1.getPos();
            let [x2,y2] = this.ball2.getPos();
            const deltaX = x2-x1;
            const deltaY = y2-y1;
            const dist = distance(x1,y1,x2,y2);
            let diffL = 0;
            if(dist!=0){
                diffL = (this.l - dist)/dist/2.0;
            }

            const m1 = this.ball1.getMasse(),
                m2 = this.ball2.getMasse();

            let min = m1;
            if(m2<min){
                min = m2;
            }

            let rapportM1 = min/m1,
                rapportM2 = min/m2;

            if(this.ball2.getFixe()||this.ball1.getFixe()){
                diffL*=2;
                //pas besoin de la masse dans ce cas ci
                rapportM1 = 1;
                rapportM2 = 1;
            }

            if(!this.ball1.getFixe()){
                x1 -= deltaX*diffL*rapportM1;
                y1 -= deltaY*diffL*rapportM1;
                this.ball1.setPos(x1,y1);
            }
            if(!this.ball2.getFixe()){
                x2 += deltaX*diffL*rapportM2;
                y2 += deltaY*diffL*rapportM2;
                this.ball2.setPos(x2,y2);
            }

            const newDist = distance(x1,y1,x2,y2);
            if(this.max_l!=0&&this.max_l*this.l<newDist){
                //déchirement
                this.alive = false;
                delete this;
            }
        }

    }

    draw(ctx){
        if(this.alive&&this.affichage){
            const [x1,y1] = this.ball1.getPos();
            const [x2,y2] = this.ball2.getPos();

            //on dessine le stick
            ctx.strokeStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);
            ctx.stroke();

            //on affiche les points
            //ils sont déjà affiché point par point
            // this.ball1.draw(ctx);
            // this.ball2.draw(ctx);
        }
    }
}

class Image2d{
    constructor(color,sticks){
        this.stick1 = sticks[0];
        this.stick2 = sticks[1];
        this.stick3 = sticks[2];
        this.stick4 = sticks[3];

        this.color = color;
    }
    draw(ctx){
        //on verifie que tous les sticks sont toujours la pour afficher
        if(this.stick1.isAlive()&&this.stick2.isAlive()&&this.stick3.isAlive()&&this.stick4.isAlive()){
            const [ball1,ball2] = this.stick1.getBalls();
            const [ball4,ball3] = this.stick3.getBalls();

            const [x1,y1] = ball1.getPos();
            const [x2,y2] = ball2.getPos();
            const [x3,y3] = ball3.getPos();
            const [x4,y4] = ball4.getPos();

            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);
            ctx.lineTo(x3,y3);
            ctx.lineTo(x4,y4);
            ctx.closePath();
            ctx.fill();
        }
    }
}


export {Ball,Stick,distance,Image2d};