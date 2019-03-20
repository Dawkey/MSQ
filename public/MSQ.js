document.addEventListener("DOMContentLoaded",function(){

    let $audio = document.getElementById("audio");
    $audio.volume = 0.1;

    let svg_radius = 200;
    let svg_width,svg_height,svg_x,svg_y;
    svg_width = svg_height = svg_radius*2 + 10;
    svg_x = svg_y = svg_radius + 5;    

    let radius_num = 512;
    let min_radius = 100;
    let radius_items = Array(radius_num).fill(min_radius);

    //把半径转化为相应x,y坐标
    function to_coordinate(radius,index,total){
        // console.log(radius);
        var angle = Math.PI*2/total*index;
        var x = Math.sin(angle)*radius + svg_x;
        var y = -Math.cos(angle)*radius + svg_y;
        return x + "," + y;

    }

    //把半径数组最终转换为svg多边形需要的point属性字符串.
    function to_points(radius_items){

        var coordinate_items = radius_items.map(function(radius,index){
            var total = radius_items.length;
            return to_coordinate(radius,index,total);
        });
        return coordinate_items.join(" ");

    }    

    new Vue({
        el: "#app",
        data: {
            width: svg_width,
            height: svg_height,
            line_width: 1,

            radius_num: radius_num,
            min_radius: min_radius,
            radius_items: radius_items,
            points: to_points(radius_items),

            analyser: null,
            analyser_array: [],
            play_flag: true,
            wave_timer: null,

            mode_flag: true,
        },

        methods: {
            get_analyser(){
                if(this.analyser !== null){
                    return;
                }
                let ctx = new AudioContext();
                let analyser = ctx.createAnalyser();
                let audiosrc = ctx.createMediaElementSource($audio);
                audiosrc.connect(analyser);
                analyser.connect(ctx.destination);
                analyser.fftSize = this.radius_num * 2;
                this.analyser = analyser;
                this.analyser_array = new Uint8Array(analyser.frequencyBinCount);
                this.wave_wave();
            },

            audio_play(){
                if(this.play_flag){
                    $audio.play();
                    if(this.wave_timer === null){
                        this.wave_wave();
                    }
                }else{
                    clearTimeout(this.wave_timer);
                    this.wave_timer = null;
                    $audio.pause();
                }
                this.play_flag = !this.play_flag;
            },

            wave_wave(){
                this.wave_timer = setTimeout(()=>{
                    // this.analyser.getByteFrequencyData(this.analyser_array);
                    this.analyser.getByteTimeDomainData(this.analyser_array);
                    this.wave_change();
                    this.wave_wave();
                },85);
            },

            wave_change(){
                let flag = true;
                for(let i=0; i<this.radius_items.length; i++){
                    let item = 100 + (this.analyser_array[i] - 128) * 7;
                    if(this.mode_flag){
                        this.radius_items[i] = item;
                    }else{

                        let j = Math.floor(i / 2);
                        if(flag){
                            this.radius_items[j] = item;
                        }else{
                            this.radius_items[this.radius_num - j - 1] = item;
                        }
                        flag = !flag;
                    }
                }
                TweenLite.to(this.$data,85/1000,{points: to_points(this.radius_items)});
            },

            mode_change(bool){
                this.mode_flag = bool;
            },

            nums_change(num){
                if(this.analyser === null){
                    this.get_analyser();
                }
                this.radius_num = num;
                this.radius_items = Array(this.radius_num).fill(this.min_radius);
                this.analyser.fftSize = this.radius_num * 2;
                this.analyser_array = new Uint8Array(this.analyser.frequencyBinCount);
            },

            width_change(num){
                this.line_width = num;
            }
        }
    });

});