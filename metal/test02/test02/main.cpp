#include <iostream>
#include <vulkan/vulkan.h>

// https://vulkan.lunarg.com/doc/sdk/1.1.92.1/mac/tutorial/html/01-init_instance.html
// https://github.com/LunarG/VulkanSamples/blob/sdk-1.1.92.0/API-Samples/01-init_instance/01-init_instance.cpp
// XCode上で環境変数の設定が必要
// メニュー Product -> Scheme -> Edit Scheme -> Run -> Environment Variables
//   VK_ICD_FILENAMES: (vulkansdk)/macOS/etc/vulkan/icd.d/MoltenVK_icd.json
//   VK_LAYER_PATH:    (vulkansdk)/macOS/etc/vulkan/explicit_layer.d

#define APP_SHORT_NAME "vulkansamples_instance"

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

int main(int argc, const char * argv[]) {
	/* VULKAN_KEY_START */

	// initialize the VkApplicationInfo structure
	VkApplicationInfo app_info = {};
	app_info.sType = VK_STRUCTURE_TYPE_APPLICATION_INFO;
	app_info.pNext = NULL;
	app_info.pApplicationName = APP_SHORT_NAME;
	app_info.applicationVersion = 1;
	app_info.pEngineName = APP_SHORT_NAME;
	app_info.engineVersion = 1;
	app_info.apiVersion = VK_API_VERSION_1_0;

	// initialize the VkInstanceCreateInfo structure
	VkInstanceCreateInfo inst_info = {};
	inst_info.sType = VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO;
	inst_info.pNext = NULL;
	inst_info.flags = 0;
	inst_info.pApplicationInfo = &app_info;
	inst_info.enabledExtensionCount = 0;
	inst_info.ppEnabledExtensionNames = NULL;
	inst_info.enabledLayerCount = 0;
	inst_info.ppEnabledLayerNames = NULL;

	VkInstance inst;
	VkResult res;

	res = vkCreateInstance(&inst_info, NULL, &inst);
	if (res == VK_ERROR_INCOMPATIBLE_DRIVER) {
		std::cout << "cannot find a compatible Vulkan ICD\n";
		exit(-1);
	} else if (res) {
		std::cout << "unknown error\n";
		exit(-1);
	}

	vkDestroyInstance(inst, NULL);

	/* VULKAN_KEY_END */

	return 0;
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------
