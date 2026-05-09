#include <metal_stdlib>
using namespace metal;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

#define vertexBufferPosition 0
#define vertexBufferTexcoord 1
#define fragmentTexture 0

struct shaderBridge{
    float4 position [[position]];
    float2 texCoord;
};

// バーテックスシェーダ
vertex struct shaderBridge vertexShader(device float4 *positionList [[buffer(vertexBufferPosition)]], device float2 *texCoordList [[buffer(vertexBufferTexcoord)]], uint vid [[vertex_id]]){
    struct shaderBridge out;
    out.position = positionList[vid];
    out.texCoord = texCoordList[vid];
    return out;
}

// フラグメントシェーダ
fragment float4 fragmentShader(struct shaderBridge in [[stage_in]], texture2d<float> texture [[texture(fragmentTexture)]]){
    constexpr sampler colorSampler;
    float4 color = texture.sample(colorSampler, in.texCoord);
    return color;
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------
