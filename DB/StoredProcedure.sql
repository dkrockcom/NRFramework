CREATE PROCEDURE `Login`(
	IN EmailUsername varchar(50),
	IN Password varchar(50)
)
BEGIN
	DECLARE UserId INT default 0;
    DECLARE RoleId INT default 0; 
    
	SELECT User.UserId, User.RoleId INTO UserId, RoleId FROM User 
    WHERE (User.Email=EmailUsername OR User.Username=EmailUsername)
    AND User.Password=Password 
    AND IsDeleted = 0 
    AND IsActive = 1;
    
	SELECT UserId, RoleId;
	
    SELECT Role.RoleId, Role.RoleName FROM UserRole 
	LEFT OUTER JOIN Role ON UserRole.RoleId = Role.RoleId
	WHERE UserRole.UserId = UserId;
END