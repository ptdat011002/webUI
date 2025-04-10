export const ipValidator = (ip: string) => {
  const ipArray = ip.split('.');
  if (ipArray.length !== 4) return false;
  return ipArray.every((item) => {
    const itemNumber = Number(item);
    return itemNumber >= 0 && itemNumber <= 255;
  });
};

export const subnetMaskValidator = (mask) => {
  try {
    // Tách subnet mask thành các phần
    const parts = mask.split('.');
    if (parts.length !== 4) {
      return false; // Subnet mask phải có 4 phần
    }

    // Chuyển các phần sang nhị phân và ghép lại
    const binaryStr = parts
      .map((part) => {
        const num = parseInt(part, 10);
        if (isNaN(num) || num < 0 || num > 255) {
          return null; // Giá trị không hợp lệ
        }
        return num.toString(2).padStart(8, '0'); // Chuyển sang nhị phân
      })
      .join('');

    if (!binaryStr) return false;

    // Kiểm tra định dạng nhị phân
    // Subnet mask hợp lệ chỉ chứa các bit 1 liên tiếp ở bên trái, sau đó là các bit 0
    if (binaryStr.includes('01')) {
      return false; // Có bit 0 xen kẽ giữa các bit 1
    }

    return true; // Subnet mask hợp lệ
  } catch (error) {
    return false; // Có lỗi xảy ra
  }
};

export const gateWayValidator = (ip, subnetMask, gateway) => {
  try {
    // Hàm chuyển IP hoặc subnet mask từ dạng thập phân sang nhị phân
    const toBinary = (ip) =>
      ip
        .split('.')
        .map((octet) => parseInt(octet, 10).toString(2).padStart(8, '0'))
        .join('');

    const binaryToDecimal = (binary) =>
      binary
        .match(/.{8}/g)
        .map((octet) => parseInt(octet, 2))
        .join('.');

    const ipBin = toBinary(ip);
    const maskBin = toBinary(subnetMask);
    const gatewayBin = toBinary(gateway);

    // Xác định địa chỉ mạng
    const networkBin = ipBin
      .split('')
      .map((bit, i) => (bit === '1' && maskBin[i] === '1' ? '1' : '0'))
      .join('');
    const networkAddress = binaryToDecimal(networkBin);

    // Xác định địa chỉ broadcast
    const wildcardBin = maskBin
      .split('')
      .map((bit) => (bit === '1' ? '0' : '1'))
      .join('');
    const broadcastBin = ipBin
      .split('')
      .map((bit, i) => (wildcardBin[i] === '1' ? '1' : bit))
      .join('');
    const broadcastAddress = binaryToDecimal(broadcastBin);

    // Kiểm tra Gateway
    if (gateway === networkAddress || gateway === broadcastAddress) {
      return false; // Gateway không được là địa chỉ mạng hoặc broadcast
    }

    // Kiểm tra xem Gateway có nằm trong subnet không
    const gatewayDecimal = parseInt(gatewayBin, 2);
    const networkDecimal = parseInt(networkBin, 2);
    const broadcastDecimal = parseInt(broadcastBin, 2);

    return gatewayDecimal > networkDecimal && gatewayDecimal < broadcastDecimal;
  } catch (error) {
    return false; // Có lỗi xảy ra
  }
};
