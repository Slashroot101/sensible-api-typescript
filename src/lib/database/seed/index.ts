import logger from "../../logger";
import database from "..";

export default async (): Promise<void> => {
  logger.info('Seeding rule data');
  await database.rule.upsert({
    where: {
      name: 'swearing'
    },
    update: {},
    create: {
      id: 1,
      name: "swearing"
    }
  });
  await database.rule.upsert({
    where: {
      name: 'blacklist'
    },
    update: {},
    create: {
      id: 2,
      name: "blacklist"
    }
  });
  await database.rule.upsert({
    where: {
      name: 'sentiment'
    },
    update: {},
    create: {
      id: 3,
      name: "sentiment"
    }
  });
  logger.info('Completed rule data seeding');

  logger.info('Seeding rule action data');
  await database.ruleAction.upsert({
    where: {
      name: 'timeout'
    },
    update: {},
    create: {
      id: 1,
      name: "timeout"
    }
  });
  await database.ruleAction.upsert({
    where: {
      name: 'ban'
    },
    update: {},
    create: {
      id: 2,
      name: "ban"
    }
  });
  await database.ruleAction.upsert({
    where: {
      name: 'kick'
    },
    update: {},
    create: {
      id: 3,
      name: "kick"
    }
  });
  await database.ruleAction.upsert({
    where: {
      name: 'warn'
    },
    update: {},
    create: {
      id: 4,
      name: "warn"
    }
  });
  await database.ruleAction.upsert({
    where: {
      name: 'tiered'
    },
    update: {},
    create: {
      id: 5,
      name: "tiered"
    }
  });
  logger.info('Completed seeding rule action data');
}