function World(){
	this.type = "world";
	if(arguments.length == 0){
		this.background = new RgbColor(0,0,0);
		this.tracer = null;
		this.view = new View();
		this.objects = new Array();
	}
};

//-----------------------------Prototypes---------------------------------
	World.prototype.Render = function(){
		var pixelColor = new RgbColor();
		var ray = new Ray3D();
		var hres = this.view.hres;
		var vres = this.view.vres;
		var pixel = this.view.pixel;
		var zw = 100;
		ray.d = new Vector3D(camera.ux,camera.uy,camera.uz);
		var sample = 2;
		for(var i=0;i<vres;i++){
			for(var j=0;j<hres;j++){
				ray.o = new Point3D(pixel*(j-hres/2-0.5),pixel*(i-vres/2+0.5),zw);
				//if(i==0&&j==0)
				//console.log(ray.o);
				pixelColor = this.tracer.TraceRay(ray);
				scene.DrawSq(j,this.view.vres - i -1,pixelColor);
			}
		}
	};

	World.prototype.AddObject = function(o){
		this.objects.push(o);
	};

	World.prototype.HitBareBones = function(r){
		var sr = new ShadeRec(this);
		var tmin = kHugeValue;
		var t;
		var n = this.objects.length;
		for(var i=0; i < n ;i++){
			var a = this.objects[i].Hit(r,sr);
			t = a.t;
			if(a.y && (t<tmin)){
				sr.hitObj = true;
				tmin = t;
				sr.color = this.objects[i].GetColor();
				//console.log(sr.color.r);
			}
		}
		//console.log(sr);
		return sr;
	};

	World.prototype.Build = function(){
		this.view.Hres(600);
		this.view.Vres(400);
		this.view.Pixel(1);
		this.view.Gamma(1);
		this.AddObject(new Plane());
		this.AddObject(new Sphere());
		this.tracer = new TraceAll(this);
		this.Render();
	};

//--------------------------Functions----------------------------

	function MaxToOne(rgb){
		var maxValue = Math.max(rgb.r, Math.max(rgb.g,rgb.b));
		if(maxValue>1){
			return rgb.Divide(maxValue);
		}
		else{
			return rgb;
		}
	};

	function ClampToColor(rgb){
		var c = new RgbColor(rgb);
		if(c.r>1||c.g>1||c.b>1){
			c.r = 1;
			c.g = 0;
			c.b = 0;
		}
		return c;
	};