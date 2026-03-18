export const hasPermission = (user, permission) => {
  if (!user || !user.roles || !Array.isArray(user.roles)) {
    return false;
  }

  const rolePermissions = {
    1: [ // Administrador 
      "users:create", "users:edit", "users:delete", "users:view_all",
      "roles:manage", "projects:view_all", "projects:create", "projects:edit", "projects:view_own",
      "consultations:view_all", "consultations:view", "consultations:view_own",
      "consultations:create", "consultations:update",
      "reports:generate", "reports:export",
      "system:config", "experiments:record",
      "files:upload", "profile:edit"
    ],
    2: [ // Desenvolvedor
      "projects:create", "projects:edit", "projects:view_own",
      "consultations:update", "consultations:view",
      "files:upload", "reports:export", "profile:edit"
    ],
    3: [ // Cliente
      "consultations:create", "consultations:view_own",
      "files:upload", "profile:edit"
    ]
  };

  return user.roles.some(role => {
    const roleId = typeof role === 'object' ? role.id : role;
    const permissions = rolePermissions[roleId] || [];
    return permissions.includes(permission);
  });
};

export const isAdmin = (user) => {
  if (!user || !user.roles || !Array.isArray(user.roles)) {
    return false;
  }
  return user.roles.some(role => {
    const roleId = typeof role === 'object' ? role.id : role;
    return roleId === 1;
  });
};

export const hasAnyPermission = (user, permissions) => {
  if (isAdmin(user)) {
    return true;
  }
  return permissions.some(permission => hasPermission(user, permission));
};

export const hasAllPermissions = (user, permissions) => {
  if (isAdmin(user)) {
    return true;
  }
  return permissions.every(permission => hasPermission(user, permission));
};

export const getUserRoleName = (user) => {
  if (!user || !user.roles || !Array.isArray(user.roles) || user.roles.length === 0) {
    return "Cliente";
  }

  const roleNames = {
    1: "Administrador",
    2: "Desenvolvedor",
    3: "Cliente"
  };

  const hasAdminRole = user.roles.some(role => {
    const roleId = typeof role === 'object' ? role.id : role;
    return roleId === 1;
  });

  if (hasAdminRole) {
    return "Administrador";
  }

  const roleId = typeof user.roles[0] === 'object' ? user.roles[0].id : user.roles[0];
  return roleNames[roleId] || "Cliente";
};