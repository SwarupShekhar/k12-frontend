export interface District {
    id: string;
    name: string;
    state: string;
    contactEmail: string;
    contractStatus: 'active' | 'pending' | 'expired';
    schoolCount?: number;
}

export interface School {
    id: string;
    districtId: string;
    name: string;
    address: string;
    principalName: string;
    principalEmail: string;

    // Stats
    activePrograms?: number;
    studentCount?: number;
    complianceScore?: number; // 0-100
}
