precision highp float;
uniform sampler2D texture;
varying vec2 texCoord;
void main(){
	vec4 fragColor = texture2D(texture, texCoord);
	gl_FragColor = fragColor;
}
