import { Router } from 'express';
]);
res.json({ items, total });
});


// create
r.post('/', csrfProtection, requirePerm(can.createIncident), async (req, res) => {
const parsed = incidentCreate.safeParse(req.body);
if (!parsed.success) return res.status(400).json({ error: 'invalid_body' });
if (!req.user) return res.status(401).json({ error: 'unauthenticated' });


const inc = await prisma.incident.create({
data: {
title: parsed.data.title,
description: parsed.data.description,
severity: parsed.data.severity as any,
reporterId: req.user.id,
assigneeId: parsed.data.assigneeId || null,
}
});


await prisma.auditLog.create({
data: { actorId: req.user.id, action: 'INCIDENT_CREATE', entity: 'INCIDENT', entityId: inc.id, meta: {} }
});


res.status(201).json(inc);
});


// get by id
r.get('/:id', async (req, res) => {
const inc = await prisma.incident.findUnique({ where: { id: req.params.id }, include: { notes: true } });
if (!inc) return res.status(404).json({ error: 'not_found' });
res.json(inc);
});


// patch
r.patch('/:id', csrfProtection, requirePerm(can.updateIncident), async (req, res) => {
const parsed = incidentPatch.safeParse(req.body);
if (!parsed.success) return res.status(400).json({ error: 'invalid_body' });
if (!req.user) return res.status(401).json({ error: 'unauthenticated' });


const inc = await prisma.incident.update({ where: { id: req.params.id }, data: parsed.data as any });
await prisma.auditLog.create({
data: { actorId: req.user.id, action: 'INCIDENT_UPDATE', entity: 'INCIDENT', entityId: inc.id, meta: parsed.data as any }
});
res.json(inc);
});


// notes
r.post('/:id/notes', csrfProtection, requirePerm(can.updateIncident), async (req, res) => {
const parsed = noteCreate.safeParse(req.body);
if (!parsed.success) return res.status(400).json({ error: 'invalid_body' });
if (!req.user) return res.status(401).json({ error: 'unauthenticated' });


const note = await prisma.note.create({
data: { body: parsed.data.body, incidentId: req.params.id, authorId: req.user.id }
});


await prisma.auditLog.create({
data: { actorId: req.user.id, action: 'NOTE_CREATE', entity: 'NOTE', entityId: note.id, meta: {} }
});


res.status(201).json(note);
});


return r;
};