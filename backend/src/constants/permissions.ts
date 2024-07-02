import { Profile } from "../entities/User.js";

export class Permission {
    [key: string]: {
      code: string;
      name: string;
      status: {
        create: boolean;
        read: boolean;
        update: boolean;
        delete: boolean;
      };
    };
  
    constructor(permission: IPermisison) {
      this.code = permission.code;
      this.name = permission.name;
      this.status = permission.status;
    }
  }
  
  interface IPermisison {
    [key: string]: {
      code: string;
      name: string;
      status: {
        create: boolean;
        read: boolean;
        update: boolean;
        delete: boolean;
      };
    };
  }
  
  export const definePermissions = (profile: Profile) => {
    switch (profile) {
      case Profile.Sudo:
        return sudoPermissions;
      case Profile.Standard:
        return standardPermissions;
    }
  };
  
  const sudoPermissions: Permission = {
    user: {
      code: "user",
      name: "Gestão de Usuários",
      status: {
        create: true,
        read: true,
        update: true,
        delete: true,
      },
    },
    conversation: {
      code: "conversation",
      name: "Gestão de Conversas",
      status: {
        create: true,
        read: true,
        update: true,
        delete: true,
      },
    },
    conversationMessage: {
        code: "conversationMessage",
        name: "Gestão de Mensagens",
        status: {
            create: true,
            read: true,
            update: true,
            delete: true,
        },
    },
    consumer: {
        code: "consumer",
        name: "Gestão de Consumidores",
        status: {
            create: true,
            read: true,
            update: true,
            delete: true,
        },
    },

  };
  
  const standardPermissions: Permission = {
    user: {
      code: "user",
      name: "Gestão de Usuários",
      status: {
        create: false,
        read: true,
        update: false,
        delete: false,
      },
    },
    conversation: {
      code: "conversation",
      name: "Gestão de Conversas",
      status: {
        create: false,
        read: true,
        update: false,
        delete: false,
      },
    },
    conversationMessage: {
        code: "conversationMessage",
        name: "Gestão de Mensagens",
        status: {
            create: false,
            read: true,
            update: false,
            delete: false,
        },
    },
    consumer: {
        code: "consumer",
        name: "Gestão de Consumidores",
        status: {
            create: false,
            read: true,
            update: false,
            delete: false,
        },
    },
  };