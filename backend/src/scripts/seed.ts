import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';

async function upsertUser(email: string, username: string, displayName: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, username, displayName, password: passwordHash },
  });
  return user;
}

async function main() {
  console.log('\nSeeding demo data...');

  const alice = await upsertUser('alice@example.com', 'alice', 'Alice', 'password123');
  const bob = await upsertUser('bob@example.com', 'bob', 'Bob', 'password123');

  // Only seed posts if none exist
  const postCount = await prisma.post.count();
  if (postCount === 0) {
    const p1 = await prisma.post.create({ data: { content: 'Hello Microblog! 👋', userId: alice.id } });
    const p2 = await prisma.post.create({ data: { content: 'Loving this lightweight feed.', userId: bob.id } });
    const p3 = await prisma.post.create({ data: { content: 'TypeScript + Prisma = ❤️', userId: alice.id } });

    await prisma.reply.create({ data: { content: 'Welcome!', postId: p1.id, userId: bob.id } });
    await prisma.reply.create({ data: { content: 'Agreed!', postId: p3.id, userId: bob.id } });

    await prisma.like.create({ data: { userId: alice.id, postId: p2.id } });
    await prisma.like.create({ data: { userId: bob.id, postId: p1.id } });
  }

  console.log('Seed complete. You can login as:');
  console.log('- alice@example.com / password123');
  console.log('- bob@example.com   / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
