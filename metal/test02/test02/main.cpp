#include <iostream>
#include <vulkan/vulkan.h>

// https://vulkan.lunarg.com/doc/view/1.0.69.0/mac/getting_started.html
// 「Xcode Examples」の「Create an Instance」
// XCode上で環境変数VK_ICD_FILENAMESの設定が必要

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

int main(int argc, const char * argv[]) {
	VkInstance instance;
	VkResult result;
	VkInstanceCreateInfo info = {};

	result = vkCreateInstance(&info, NULL, &instance);
	std::cout << "vkCreateInstance result: " << result  << "\n";

	vkDestroyInstance(instance, nullptr);
	return 0;
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------
