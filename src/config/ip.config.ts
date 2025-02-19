/**
 * 服务器相关可配置项
*/

// 开发环境服务器IP
// 开发端口
// const developmentBaseIp = "localhost";
// const devPort = 26737; //


// const developmentBaseIp = "192.168.0.9";   // 李直服务器
// const devPort = 26737;  // 李直客户端开发端口
// const devPort = 31011;  // 李直客户端开发端口
// 
// const developmentBaseIp = "192.168.0.110";   // 海军服务器
// const devPort = 8081;  // 海军服务器开发端口
// const devPort = 31005; // 海军客户端开发端口
// const devPort = 31016;    // 海军云端开发端口

// const developmentBaseIp = "192.168.0.13";   // 包公服务器
// const devPort = 8081;  // 包公服务器开发端口
// const developmentBaseIp = "111.198.29.46";
// const devPort = 26737;  // 包公客户端开发端口

// const developmentBaseIp = "111.198.29.46"; // 公司服务器
// const devPort = 31012; // 公司服务器端口
// const devPort = 37778; // 公司服务器端口


// const developmentBaseIp = "111.198.29.46"; // 海军本地临时
// const devPort = 31016; // 海军本地云端 灾情快报
// const devPort = 31005; // 海军本地客户端

const developmentBaseIp = "111.198.29.46"; // 荔枝本地临时
const devPort = 31011; // 荔枝本地临时

// const developmentBaseIp = "111.198.29.46"; // 包包客户端
// const devPort = 31006; // 包包客户端


/* 打包生产端口 */
// const productionBaseIp = "111.198.29.46"; // 公司服务器
// let proPort = 37778; // 北京公司服务器端口
// let proPort = 31012; // 西安服务器端口

// const productionBaseIp = "10.228.19.81"; // 气象局内网服务器
// let proPort = 7778; // 气象局内网服务器端口

const productionBaseIp = "114.141.161.126"; // 临港服务器
let proPort = 9000; // 临港服务器端口

// const productionBaseIp = "localhost"; // 客户端IP
// let proPort = 26737; // 客户端端口


/* online server 在线服务器 （待上线后要替换成线上的真正的服务器域名） */
// export const serverBaseIp = "192.168.0.13";
// export const serverPort = 8081;           //海军端口
// export const serverBaseIp = "111.198.29.46";  //公司服务器
// export const serverPort = 31016;           //公司海军本地端口
// export const serverPort = 31012;                //西安服务器端口
// export const serverPort = 31012;                //西安服务器端口
// export const serverPort = 37778;              //北京服务器端口
// export const serverBaseIp = "10.228.19.81";  //气象局服务器
// export const serverPort = 7778;              //气象局服务器端口
export const serverBaseIp = "114.141.161.126";  //临港服务器
export const serverPort = 9000;              //临港服务器端口

// URL前缀
export const basePath = '';
// websocket URL前缀
export const wsBasePath = '/helper/chat';

const PCport = location.hash.match(/(?<=\?port=)\d+$/g);
//@ts-ignore
if (import.meta.env.VITE_CLIENT === 'PC' && PCport) proPort = +PCport[0];

const localIp = localStorage.getItem("DEVIP");
const localPort = localStorage.getItem("DEVPORT");
export const devVisiblePort = localPort ? localPort : devPort;
export const baseIp = process.env.NODE_ENV === "development" ? (localIp ? localIp : developmentBaseIp) : productionBaseIp;
export const port = process.env.NODE_ENV === "development" ? devVisiblePort : proPort;
export const baseURL = "http://" + baseIp + ":" + port + basePath;
export const serverBaseURL = "http://" + serverBaseIp + ":" + serverPort + basePath;
export const roboterBaseURL = "http://" + serverBaseIp + ":" + serverPort;
export const websocketURL = "ws://" + serverBaseIp + ":" + serverPort + wsBasePath;
export const frontBaseURL = "/earlywarning";