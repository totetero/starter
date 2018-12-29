#include <iostream>
#include <vulkan/vulkan.h>

// https://vulkan.lunarg.com/doc/view/1.0.69.0/mac/getting_started.html
// 「Xcode Examples」の「Get a List of Layers」
// XCode上で環境変数VK_ICD_FILENAMESの設定が必要
// XCode上で環境変数VK_LAYER_PATHの設定が必要

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

int main(int argc, const char * argv[]) {
	VkInstance instance;
	VkResult result;
	VkInstanceCreateInfo info = {};
	uint32_t instance_layer_count;

	result = vkEnumerateInstanceLayerProperties(&instance_layer_count, nullptr);
	std::cout << instance_layer_count << " layers found!\n";
	if (instance_layer_count > 0) {
		std::unique_ptr<VkLayerProperties[]> instance_layers(new VkLayerProperties[instance_layer_count]);
		result = vkEnumerateInstanceLayerProperties(&instance_layer_count, instance_layers.get());
		for (int i = 0; i < instance_layer_count; ++i) {
			std::cout << instance_layers[i].layerName << "\n";
		}
	}

	result = vkCreateInstance(&info, NULL, &instance);
	std::cout << "vkCreateInstance result: " << result  << "\n";

	vkDestroyInstance(instance, nullptr);
	return 0;
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------
