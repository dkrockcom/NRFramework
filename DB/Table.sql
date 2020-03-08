CREATE TABLE `User` (
  `UserId` int(11) NOT NULL AUTO_INCREMENT,
  `Username` varchar(45) DEFAULT NULL,
  `Password` varchar(100) DEFAULT '',
  `Email` varchar(100) DEFAULT NULL,
  `Firstname` varchar(100) DEFAULT NULL,
  `Lastname` varchar(100) DEFAULT NULL,
  `DOB` datetime DEFAULT NULL,
  `RoleId` int(11) NOT NULL DEFAULT '0',
  `IsActive` tinyint(4) NOT NULL DEFAULT '1',
  `IsDeleted` tinyint(4) NOT NULL DEFAULT '0',
  `CreatedOn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` int(11) NOT NULL DEFAULT '0',
  `ModifiedOn` datetime DEFAULT NULL,
  `ModifiedBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`UserId`),
  UNIQUE KEY `Email_UNIQUE` (`Email`)
);

CREATE TABLE `Role` (
  `RoleId` int(11) NOT NULL AUTO_INCREMENT,
  `RoleName` varchar(100) NOT NULL,
  `CreatedOn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` int(11) NOT NULL DEFAULT '0',
  `ModifiedOn` datetime DEFAULT NULL,
  `ModifiedBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`RoleId`)
);

CREATE TABLE `UserRole` (
  `UserRoleId` int(11) NOT NULL AUTO_INCREMENT,
  `UserId` int(11) NOT NULL,
  `RoleId` int(11) NOT NULL,
  `CreatedOn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` int(11) NOT NULL DEFAULT '0',
  `ModifiedOn` datetime DEFAULT NULL,
  `ModifiedBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`UserRoleId`)
);

CREATE TABLE `Lookup` (
  `LookupId` int(11) NOT NULL AUTO_INCREMENT,
  `LookupTypeId` int(11) NOT NULL,
  `DisplayValue` varchar(500) NOT NULL,
  `ScopeId` int(11) DEFAULT '0',
  `CustomValue` varchar(2000) DEFAULT NULL,
  `SortOrder` int(11) NOT NULL DEFAULT '0',
  `IsDeleted` tinyint(4) NOT NULL DEFAULT '0',
  `CreatedOn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` int(11) NOT NULL DEFAULT '0',
  `ModifiedOn` datetime DEFAULT NULL,
  `ModifiedBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`LookupId`)
);

CREATE TABLE `LookupType` (
  `LookupTypeId` int(11) NOT NULL AUTO_INCREMENT,
  `LookupType` varchar(100) DEFAULT NULL,
  `ScopeId` int(11) DEFAULT '0',
  `IsDeleted` tinyint(4) NOT NULL DEFAULT '0',
  `CreatedOn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` int(11) NOT NULL DEFAULT '0',
  `ModifiedOn` datetime DEFAULT NULL,
  `ModifiedBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`LookupTypeId`)
);