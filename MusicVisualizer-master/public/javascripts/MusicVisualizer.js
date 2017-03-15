function MusicVisualizer(obj) {
    this.source=null;
    this.firstPlay=true;

    this.count=0;

    this.analyser=MusicVisualizer.ac.createAnalyser();
    this.size=obj.size;
    this.analyser.fftSize=this.size*2;

    this.gainNode=MusicVisualizer.ac[MusicVisualizer.ac.createGain?'createGain':'createGainNode']()
    this.gainNode.connect(MusicVisualizer.ac.destination);

    this.visualizer=obj.visualizer;

    this.analyser.connect(this.gainNode);

    this.xhr=new XMLHttpRequest()


}
MusicVisualizer.ac=new (window.AudioContext||window.webkitAudiocontext)();

MusicVisualizer.prototype.load=function (url,fun) {
    this.xhr.abort()
    this.xhr.open('GET',url)
    this.xhr.responseType='arraybuffer';
    var that=this
    this.xhr.onload=function () {
        fun(that.xhr.response);
    }
    this.xhr.send()
}

MusicVisualizer.prototype.decode=function (arraybuffer,fun) {
    MusicVisualizer.ac.decodeAudioData(arraybuffer,function (buffer) {
        fun(buffer)
    },function (err) {
        console.log(err)
    })
}

MusicVisualizer.prototype.play=function (url) {
    var n=++this.count;
    var that=this;
    this.source&&this.stop()
    this.load(url,function (arraybuffer) {
        if(n!=that.count) return;
        that.decode(arraybuffer,function (buffer) {
            if(n!=that.count) return;
            var bufferSource=MusicVisualizer.ac.createBufferSource();
            bufferSource.buffer=buffer;
            bufferSource.connect(that.analyser)
            bufferSource[bufferSource.start?'start':'noteOn'](0);
            that.source=bufferSource
            if(that.source&&that.firstPlay){
                that.visualize()
            }
            that.firstPlay=false;
        })
    })
}
MusicVisualizer.prototype.stop=function () {
    var that=this;
    this.source[that.source.stop?'stop':'noteOff']()
}

MusicVisualizer.prototype.changeVolume=function (percent) {
    this.gainNode.gain.value=percent*percent
}

MusicVisualizer.prototype.visualize=function () {
    var arr=new Uint8Array(this.analyser.frequencyBinCount); //为FFT的一般 实时得到的音频数据个数
    requestAnimationFrame=window.requestAnimationFrame||
        window.webkitRequestAnimationFrame||
        window.mozRequestAnimationFrame;
    var that=this;
    function v() {
        that.analyser.getByteFrequencyData(arr);
        that.visualizer(arr)
        requestAnimationFrame(v)
    }
    v()
}