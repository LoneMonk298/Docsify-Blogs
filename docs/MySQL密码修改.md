# Window系统8.0+版本MySQL密码修改


## 步骤1
Win + R 输入 service.msc  打开服务管理

## 步骤2
下滑找到MySQL服务，右键点击停止运行

## 步骤3
Win + R 输入cmd切换到MySQL安装目录

> [!TIP] 提示
> 默认打开时的目录为`C:\` ，假如你的安装目录是` D:\`， 可以直接输入命令` D:`先切换盘符
> 接着切换安装目录示例:`cd mysql-8.0.43-winx64\bin`  (输入mys按Tab可以自动补全无需手动输) 

## 步骤4
输入命令执行跳过权限验证      
> mysqld --console --skip-grant-tables --shared-memory

> [!WARNING] 注意
> 输入该命令后重新执行 Win + R 输入cmd(重复步骤3)打开一个新的窗口，上个窗口不要关闭，不要关闭

## 步骤5
重复步骤3，输入命令无密码登录 MySQL 
> mysql -u root

## 步骤6
输入命令修改密码 

> [WARNING] 注意
> `；` 符号也要输入

>FLUSH PRIVILEGES;
>USE mysql;
>ALTER USER 'root'@'localhost' IDENTIFIED BY '你的新密码';
>FLUSH PRIVILEGES;
>exit;

## 步骤7
关闭所有cmd窗口重复步骤1，下滑找到MySQL服务，右键点击启用即可

## 步骤8
简单测试：
> mysql -u root -p 
> #输入新密码，能登录则重置成功



