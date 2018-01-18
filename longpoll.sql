/*
Navicat MySQL Data Transfer

Source Server         : Localhost
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : longpoll

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2018-01-18 16:04:28
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `product`
-- ----------------------------
DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) NOT NULL COMMENT 'หัวข้อ',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of product
-- ----------------------------
INSERT INTO `product` VALUES ('1', 'Product 1');
INSERT INTO `product` VALUES ('2', 'Product 2');
INSERT INTO `product` VALUES ('3', 'Product 3');
