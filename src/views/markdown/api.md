# API 后端文档汇总（内部）

**说明** ：该文档用于开发测试需要，如有需要协助或不规范的地方，请联系，为了您的阅读便利，我们会及时更正错误。感谢您的阅读。

## 1.获取OTA信息

**微注**：需传递参数。

url:http://47.106.118.159:8001/ota/info?sourceName=bluetoothswatch&state=1
<br/>
port:8001
<br/>
method(注意): get

### 1.1请求参数，No.1.1表

| 字段名       | 变量名  |  必填 |  类型 |示例值|  描述|
| :--------  | :-----  | :----:  | :----:  | :----:  | :----:  |
| 设备类型| sourceName|是|string|1测试环境、2正式环境| 蓝牙手表固定传bluetoothswatch|
| 环境| state |是|Int|1测试环境、2正式环境||
| 设备id| imei |是|string|设备id||
| 设备型号| modelid |是|string|设备型号||
| 版本（批次）号| version |是|string|版本（批次）号||
### 1.2返回事例及数据说明，No.1.2表

```json
{
	state: 0,
	url: "",
	version: "",
	packageSize: 0,
	updateDate: 0,
	description: "",
	importance:0
}
```

| 字段名       | 变量名  |  必填 |  类型 |示例值|  描述|
| :--------  | :-----  | :----:  | :----:  | :----:  | :----:  |
| 状态| state |是|int|0、1、2|0没有更新的版本号、1测试版本、2正式版本|
|下载链接|url |是|string||自行下载bin文件|
| 文件大小|packageSize |是|int|1193999|bytes类型，计算MB，需要➗ 1024*1024|
| 版本描述|description |是|string||版本内容描述|
| 重要性|importance |是|int|1、2、3|等级|
| 版本标题、版本号|version |是|string|||
