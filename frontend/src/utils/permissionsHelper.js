const PERMISSIONS_BY_ROLE = {
  admin: [
    "users:create", "users:edit", "users:delete", "users:view_all",
    "roles:manage", "projects:view_all", "projects:create", "projects:edit", "projects:view_own",
    "consultations:view_all", "consultations:view", "consultations:view_own",
    "consultations:create", "consultations:update",
    "reports:generate", "reports:export",
    "system:config", "experiments:record",
    "files:upload", "profile:edit"
  ],
  dev: [
    "projects:create", "projects:edit", "projects:view_own",
    "consultations:update", "consultations:view",
    "files:upload", "reports:export", "profile:edit"
  ],
  cliente: [
    "consultations:create", "consultations:view_own",
    "files:upload", "profile:edit"
  ]
};

const normalizeRoleName = (roleName = "") =>
  roleName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const resolveRoleKey = (role) => {
  if (role && typeof role === "object" && role.nome) {
    const normalized = normalizeRoleName(role.nome);
    if (normalized.includes("admin")) return "admin";
    if (normalized.includes("desenvolvedor") || normalized.includes("pesquisador")) return "dev";
    if (normalized.includes("cliente")) return "cliente";
  }

  // Fallback por ID para cenários em que a role venha apenas numérica
  const roleId = typeof role === "object" ? role.id : role;
  if (roleId === 1) return "admin";
  if (roleId === 2) return "cliente";
  if (roleId === 3) return "dev";

  return null;
};

export const hasPermission = (user, permission) => {
  if (!user || !Array.isArray(user.roles)) {
    return false;
  }

  return user.roles.some((role) => {
    const roleKey = resolveRoleKey(role);
    if (!roleKey) return false;
    return (PERMISSIONS_BY_ROLE[roleKey] || []).includes(permission);
  });
};

export const isAdmin = (user) => {
  if (!user || !Array.isArray(user.roles)) {
    return false;
  }
  return user.roles.some((role) => resolveRoleKey(role) === "admin");
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

  if (isAdmin(user)) {
    return "Administrador";
  }

  const firstRoleKey = resolveRoleKey(user.roles[0]);
  if (firstRoleKey === "dev") return "Desenvolvedor";
  if (firstRoleKey === "cliente") return "Cliente";
  return "Cliente";
};