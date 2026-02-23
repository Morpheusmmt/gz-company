//dados do banco 

role = {
   
    nome: "Administrador",
    descrição: "Administrador do sistema", 
    permissões: [
        "users:create",           
        "users:edit",            
        "users:delete",           
        "users:view_all",         
        "roles:manage",           // Gerenciar papéis e permissões
        "projects:view_all",      // Ver todos os projetos
        "consultations:view_all", // Ver todas as consultorias
        "reports:generate",       // Gerar relatórios do sistema
        "system:config"          // Configurar integrações
],
    ativo: true
}

role = {

    nome: "DESENVOLVEDOR",
    descrição: "Gerenciador de projetos e serviços", 
    permissões: [
        
        "projects:create",        // Criar novos projetos
        "projects:edit",          // Editar projetos
        "projects:view_own",      // Ver projetos atribuídos
        "consultations:update",   // Atualizar status de serviços
        "consultations:view",     // Ver serviços atribuídos
        "files:upload",           // Fazer upload de documentos
        "reports:export"          // Exportar relatórios técnicos
],
    ativo: true

}
role = {

    nome: "CLIENTE",
    descrição: "Só ve suas própias consultorias", 
    permissões: [
    
        "consultations:create",   // Solicitar nova consultoria
        "consultations:view_own", // Ver suas próprias consultorias
        "files:upload",           // Enviar arquivos complementares
        "profile:edit"            // Editar próprio perfil
    ],
    ativo: true

}