precision highp float;
attribute vec3 vs_attr_pos;
attribute vec2 vs_attr_uvc;
uniform mat4 vs_unif_mat;
varying vec2 texCoord;
void main(){
	texCoord = vs_attr_uvc;
	gl_Position = vs_unif_mat * vec4(vs_attr_pos, 1.0);
}
