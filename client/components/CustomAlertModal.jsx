import { Modal, View, Text, TouchableOpacity } from 'react-native';

const CustomAlertModal = ({
  visible,
  onClose,
  icon,
  title,
  subtitle,
  buttons = [],
  variant = 'single',
}) => {
  const renderButtons = () => {
    if (variant === 'single') {
      return (
        <View className="mt-6 flex w-full items-center">
          <TouchableOpacity onPress={onClose} className="w-1/2 rounded-lg bg-blue-600 px-4 py-3">
            <Text className="text-center text-base font-semibold text-white">OK</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View className="mt-6 flex-row justify-between">
        <TouchableOpacity
          onPress={buttons[0]?.onPress || onClose}
          className="w-[45%] rounded-lg bg-gray-100 px-4 py-3">
          <Text className="text-center text-base font-semibold text-gray-600">
            {buttons[0]?.text || 'Reject'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={buttons[1]?.onPress || onClose}
          className="w-[45%] rounded-lg bg-blue-600 px-4 py-3">
          <Text className="text-center text-base font-semibold text-white">
            {buttons[1]?.text || 'Accept'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      statusBarTranslucent
      onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/60 px-4">
        <View className="w-full max-w-sm rounded-2xl bg-white p-6">
          {icon && <View className="mb-4 items-center">{icon}</View>}
          <Text className="text-center text-xl font-bold text-gray-900">{title}</Text>
          {subtitle && <Text className="mt-2 text-center text-base text-gray-600">{subtitle}</Text>}
          {renderButtons()}
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlertModal;
