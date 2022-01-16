"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clubLogHandler = void 0;
const clubLogHandler = async (dbClub, apiClub) => {
    let clubLogs = [];
    if (apiClub.description !== dbClub.rawData.description) {
        clubLogs.push({
            type: 'settings',
            data: {
                data: {
                    type: 'description',
                    old: dbClub.rawData.description,
                    new: apiClub.description
                }
            },
            timestamp: new Date().toISOString()
        });
    }
    if (apiClub.badgeId !== dbClub.rawData.badgeId) {
        clubLogs.push({
            type: 'settings',
            data: {
                data: {
                    type: 'badge',
                    old: dbClub.rawData.badgeId.toString(),
                    new: apiClub.badgeId.toString()
                }
            },
            timestamp: new Date().toISOString()
        });
    }
    if (apiClub.requiredTrophies !== dbClub.rawData.requiredTrophies) {
        clubLogs.push({
            type: 'settings',
            data: {
                data: {
                    type: 'requirement',
                    old: dbClub.rawData.requiredTrophies.toString(),
                    new: apiClub.requiredTrophies.toString()
                }
            },
            timestamp: new Date().toISOString()
        });
    }
    if (apiClub.type !== dbClub.rawData.type) {
        clubLogs.push({
            type: 'settings',
            data: {
                data: {
                    type: 'status',
                    old: dbClub.rawData.type,
                    new: apiClub.type
                }
            },
            timestamp: new Date().toISOString()
        });
    }
    const members = apiClub.members;
    const dbMembers = dbClub.rawData.members;
    const removedMembers = members.filter(m => !dbMembers.some(dbm => dbm.tag === m.tag));
    const addedMembers = dbMembers.filter(dbm => !members.some(m => m.tag === dbm.tag));
    addedMembers.forEach(m => {
        clubLogs.push({
            type: 'members',
            data: {
                joined: true,
                player: {
                    name: m.name,
                    tag: m.tag,
                    club: {
                        tag: apiClub.tag,
                        name: apiClub.name
                    }
                }
            },
            timestamp: new Date().toISOString()
        });
    });
    removedMembers.forEach((m) => {
        clubLogs.push({
            type: 'members',
            data: {
                joined: false,
                player: {
                    name: m.name,
                    tag: m.tag,
                    club: {}
                }
            },
            timestamp: new Date().toISOString()
        });
    });
    const newRoles = apiClub.members.filter((m) => m.role !== dbClub.rawData.members.find(dbm => dbm.tag === m.tag)?.role);
    newRoles.forEach((m) => {
        if (dbClub.rawData.members.find(dbm => dbm.tag === m.tag) && apiClub.members.find(am => am.tag === m.tag)) {
            clubLogs.push({
                type: 'roles',
                data: {
                    data: {
                        type: 'role',
                        old: dbClub.rawData.members.find(dbm => dbm.tag === m.tag)?.role || "unknown",
                        new: m.role
                    },
                    player: {
                        name: m.name,
                        tag: m.tag,
                        club: {}
                    }
                },
                timestamp: new Date().toISOString()
            });
        }
        ;
    });
    const output = [...clubLogs, ...dbClub.clubLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return output;
};
exports.clubLogHandler = clubLogHandler;
//# sourceMappingURL=clubLogHandler.js.map