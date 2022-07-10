import React,{useEffect,useRef,useState} from 'react';
import Engine_2d from '../utils/engine_2d';
import { Ball, Stick } from '../utils/objects';
import flag_image from '../images/flag.jpg';
import flag_image2 from '../images/drapeau_americain.png';


const Canvas = (props) => {
    const FPS = 100;
    const canvasRef = useRef(null);

    const [engine,setEngine] = useState(new Engine_2d());
    const [isGravity, setIsGravity] = useState(true);
    let prevPos = [null,null];

    let startTime = null;

    const animate = () =>{
        setTimeout(()=>{
            //dessin
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            

            //on y mets la taille de l'écran
            context.canvas.width = window.innerWidth;
            context.canvas.height = window.innerHeight;

            //on récupére la taille
            const width = context.canvas.width, height = context.canvas.height;

            context.fillStyle = '#000000';
            context.fillRect(0, 0, width, height);

            //on update
            engine.update();

            //engine.collision();

            //on lance l'affichage
            engine.draw(context);
            
            //on update
            requestAnimationFrame(animate);
            
        },1000.0/FPS);
    };

    //on place un fond noir
    useEffect(()=>{
        if(engine.getBalls().length==0){

            // //corde
            // const points_rope1 = engine.addRope(500,100,600,600,60);
            // points_rope1[0].setFixe(true);
            // points_rope1[points_rope1.length-1].setSpeed(9,9);

            // const points_rope2 = engine.addRope(1200,100,700,600,60);
            // points_rope2[0].setFixe(true);
            // points_rope2[points_rope2.length-1].setSpeed(9,9);

            // const points_rope3 = engine.addRope(1600,400,1600,700,30);
            // points_rope3[0].setFixe(true);
            // points_rope3[points_rope3.length-1].setSpeed(30,30);

            // //cube
            // const [x,y] = points_rope1[points_rope1.length-1].getPos();
            // const points_cube = engine.addCube(x,y,100,100,20,[0,-30],[0,-30]);
            // engine.addStick(points_rope1[points_rope1.length-1],points_cube[0]);
            // engine.addStick(points_rope2[points_rope2.length-1],points_cube[1]);

            // engine.addCube(100,500,200,200,50,[30,30]);

            // engine.addCube(1600,200,100,100,20,[30,10],[30,10],[30,10],[30,10]);


            //cloth
            engine.addFlag(flag_image,100,200,800,500,50,20);
            engine.addFlag(flag_image2,1000,200,800,500,50,20);


            // //ball mouse
            // const ballMouse1 = engine.addBall(0,0);
            // ballMouse1.setFixe(true);
            // const ballMouse2 = engine.addBall(0,0);
            // ballMouse2.setFixe(true);
            // const stick1 = engine.addStick(ballMouse1,ballMouse2);

            //on ajoute les events
            window.addEventListener('mousedown',e=>{
                prevPos = [e.pageX,e.pageY];
            });
            window.addEventListener('mousemove',e=>{
                if(prevPos[0]!=null){
                    if(performance.now()-startTime>50){
                        const [x,y] = prevPos;
                        const ball1 = new Ball(x,y);
                        const ball2 = new Ball(e.pageX,e.pageY);

                        const stick1 = new Stick(ball1,ball2);

                        engine.cutStick(stick1);

                        prevPos = [e.pageX,e.pageY];
                        startTime = performance.now();
                    }
                }
            });
            window.addEventListener('mouseup',e=>{
                prevPos = [null,null];
                startTime = performance.now();
            });
            window.onkeydown = e => {
                console.log(e);
                if(e.keyCode===32){
                    engine.setGravity(false);
                    setIsGravity(false);
                }
            };
            window.onkeyup = e => {
                console.log(e);
                startTime = null;
                if(e.keyCode===32){
                    engine.setGravity(true);
                    setIsGravity(true);
                }
            };


            //on lance l'animation
            animate();
        }
    }, []);

    return (<div>
            {((!isGravity)&&<h4>GRAVITY OFF BITCHES</h4>)}
            <canvas ref={canvasRef} {...props}/>
        </div>);
};


export default Canvas;