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

    nome: "PESQUISADOR",
    descrição: "Gerenciador de projetos e consultorias", 
    permissões: [
        
        "projects:create",        // Criar novos projetos de P&D
        "projects:edit",          // Editar projetos
        "projects:view_own",      // Ver projetos atribuídos
        "experiments:record",     // Registrar resultados experimentais
        "consultations:update",   // Atualizar status de consultorias
        "consultations:view",     // Ver consultorias atribuídas
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