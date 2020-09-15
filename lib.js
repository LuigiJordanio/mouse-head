    
    let style = document.createElement('style');
    style.innerHTML = `*, *:hover{cursor:none}.mmh-box{position:fixed;top:24px;left:24px;padding:8px;border-radius:8px;color:#fff;font-family:Arial,sans-serif;background-color:#7dd3b4;display:grid;grid-row:repeat(auto,3)}.mmh-box p{line-height:160%;text-align:center;margin-top:8px}.mmh-box button{width:100%;height:48px;border-radius:4px;margin-top:8px;font-family:Arial,sans-serif;background-color:#163b53;color:#fff;border:none;font-size:16px}.mmh-box button:focus{outline:#f9cb3d solid 4px;outline-offset:4px}#canvas{border-radius:8px;z-index:99;padding:8px;background:#3caf85;width:160px;height:160px}.mmh-box .close{align-items:flex-start;height:16px;font-size:13px;width:16px;text-align:center;border-radius:100%;background:#d02037;display:flex;align-items:center;justify-content:center;cursor:pointer}img{pointer-events:none;position:absolute}html{cursor:none}`;

    document.getElementsByTagName('head')[0].appendChild(style);
    //Caregando arquivos para o uso da biblioteca
    let tfMin = document.createElement('script');
    
    tfMin.src = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js";
    document.getElementsByTagName('head')[0].appendChild(tfMin);
    
    let teachablemachine = document.createElement('script');

    teachablemachine.src = "https://cdn.jsdelivr.net/npm/@teachablemachine/pose@0.8/dist/teachablemachine-pose.min.js";

    document.getElementsByTagName('head')[0].appendChild(teachablemachine);    
    
    var x, y; 
    var px, py; 
    px = py = 0; 

    // Elemento que será utilizado com cursos 
    var cursor = document.createElement('img');
    cursor.src = "https://media.geeksforgeeks.org/wp-content/uploads/20200319212118/cursor2.png";
    cursor.width = 15;
    cursor.height = 20;
    cursor.id="cursor";
    cursor.classList.add('head-mouse-cursor');
        
    let body = document.getElementsByTagName('body')[0];
        
    body.appendChild(cursor);
        
//
//    let canvaElement = document.createElement('canvas');
//    canvaElement.id = 'canvas';
        
    let labelContainerElement = document.createElement('div');
        labelContainerElement.id = 'label-container';
        
//    body.appendChild(canvaElement);
    body.appendChild(labelContainerElement);
    
    

    /* O mutex é usado para evitar vários eventos de clique de
        disparando ao mesmo tempo devido à posição diferente
        do cursor */ 
    var mutex = false; 

    /* 
     O evento a seguir está selecionando o elemento
      no cursor da imagem e dispara um clique na posição dele.
      O evento a seguir é acionado apenas quando o mouse é pressionado.
     */ 
    window.addEventListener("mouseup", function(e) { 
        
        // Coloca o objeto na posição do cursor da imagem 
        var tmp = document.elementFromPoint(x + px, y + py);  
        mutex = true; 
        tmp.click(); 
        cursor.style.left = (px + x) + "px"; 
        cursor.style.top = (py + y) + "px"; 
    }) 

    /* Fazendo a imagem acompanhar o movimento comum do mouse */ 
    window.addEventListener("mousemove", function(e) { 

        // Recuperando posição do mouse  
        x = e.clientX; 
        y = e.clientY; 

        // Atribuindo margens a imagem para acompanhar a movimentação do mouse. 
        cursor.style.left = (px + x) + "px"; 
        cursor.style.top = (py + y) + "px"; 

    }); 

        
    // More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

    // the link to your model provided by Teachable Machine export panel
    const URL = "https://teachablemachine.withgoogle.com/models/RufFlH_7F/";
    let model, webcam, ctx, labelContainer, maxPredictions;
    
    document.querySelector('*[data-head-mouse]').onclick = async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // Note: the pose library adds a tmPose object to your window (window.tmPose)
        model = await tmPose.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const size = 160;
        const flip = true; // whether to flip the webcam
        webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // append/get elements to the DOM
        const canvas = document.getElementById("canvas");
        canvas.width = size; canvas.height = size;
        ctx = canvas.getContext("2d");
        labelContainer = document.getElementById("label-container");
        
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div").innerHTML);
        }
        
    document.querySelector('*[data-cancel-mouse]').onclick = function (){
//        document.querySelector('.mmh-box').remove();
        webcam.webcam.stop();
    }
    }
    
    

    async function loop(timestamp) {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    }

    async function predict() {
        // Prediction #1: run input through posenet
        // estimatePose can take in an image, video or canvas html element
        const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
        // Prediction 2: run input through teachable machine classification model
        const prediction = await model.predict(posenetOutput);

        for (let i = 0; i < prediction.length; i++) {
            const classPrediction =
           	 prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            

            if(prediction[i].probability > 0.95){
                
                
                labelContainer.innerHTML = prediction[i].className;

 				var cursor = document.getElementById("cursor");  
 				var cursorTop = cursor.offsetTop;
 				var cursorTop = cursor.offsetLeft;
				
				var marginLeft =parseInt(cursor.style.left);
				var marginTop =parseInt(cursor.style.top);


                var tmp = document.elementFromPoint(marginLeft, marginTop);  
                mutex = true; 

 				switch(prediction[i].className){

 					case 'Esquerda': 
 						marginLeft-= 5;
 					break;

 					case 'Direita':

 						marginLeft+=5;
 					break;


 					case 'Baixo':
 						marginTop+=5;
 					break;


 					case 'Cima':
 						marginTop-=5;
 					
                    break;
                    
					case 'Clique':
           			  tmp.click(); 
					break;
 				}


 				cursor.style.left = marginLeft + 'px';
 				cursor.style.top = marginTop + 'px';
            }
        }

        // finally draw the poses
        drawPose(pose);
    }

    function drawPose(pose) {
        if (webcam.canvas) {
            ctx.drawImage(webcam.canvas, 0, 0);
            // draw the keypoints and skeleton
            if (pose) {
                const minPartConfidence = 0.5;
                tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
                tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
            }
        }
    }