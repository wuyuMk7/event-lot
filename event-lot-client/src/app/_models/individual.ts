export class GroupInfo {
  id: string;
  receiving: boolean;
}

export class Individual {
  id: string;
  name: string;
  email: string;
  avatar: string;
  groups: GroupInfo[]; 
}
