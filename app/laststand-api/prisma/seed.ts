import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const generateRandomName = () => {
	const firstName = [
		"ali",
		"ahmet",
		"baris",
		"can",
		"deniz",
		"emre",
		"fatma",
		"gul",
		"hande",
		"ilker",
	];
	const lastName = [
		"yilmaz",
		"kaya",
		"demir",
		"sahin",
		"koc",
		"cetin",
		"yildirim",
		"aksoy",
		"ozturk",
		"karaca",
	];

	const randomFirstName = firstName[Math.floor(Math.random() * firstName.length)];
	const randomLastName = lastName[Math.floor(Math.random() * lastName.length)];

	return randomFirstName.charAt(0) + randomLastName;
};

const generateRandomAvatar = () => {
	const avatarUrls = [
		"https://images.unsplash.com/photo-1574184739165-f7614d23f4d1?ixid=M3w0NzAxMzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTkxNjZ8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1654110455429-cf322b40a906?ixid=M3w0NzAxMzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTkxNjd8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1542157585-ef20bfcce579?ixid=M3w0NzAxMzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTkxNjd8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1542157585-ef20bfcce579?ixid=M3w0NzAxMzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTkxNjh8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1523111343671-c0872e1ac556?ixid=M3w0NzAxMzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTkxNjh8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1554286421-8cfbce5c9740?ixid=M3w0NzAxMzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTkxNjl8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1541911087797-f89237bd95d0?ixid=M3w0NzAxMzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTkxNzB8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1618077360395-f3068be8e001?ixid=M3w0NzAxMzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTkxNzB8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1590586029974-2c90c0718449?ixid=M3w0NzAxMzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTkxNzF8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1592992584424-bb6c75136025?ixid=M3w0NzAxMzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTkxNzF8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1566847438217-76e82d383f84?ixid=M3w0NzAxMzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTkxNzJ8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1596957901846-a0722f546502?ixid=M3w0NzAxMzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTkxNzJ8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1515405295579-ba7b45403062?ixid=M3w0NzAxMzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTkxNzN8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1597838816882-4435b1977fbe?ixid=M3w0NzAxMzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTkxNzR8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1515405295579-ba7b45403062?ixid=M3w0NzAxMzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTkxNzR8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixid=M3w0NzAxMzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTkxNzV8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1578589318433-39b5de440c3f?ixid=M3w0NzAxMzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTkxNzZ8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1555703473-5601538f3fd8?ixid=M3w0NzAxMzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTkxNzZ8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1578589318433-39b5de440c3f?ixid=M3w0NzAxMzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTkxNzd8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1554286421-8cfbce5c9740?ixid=M3w0NzAxMzN8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTk1MjJ8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1485290334039-a3c69043e517?ixid=M3w0NzAxMzN8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTk1MjN8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixid=M3w0NzAxMzN8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTk1MjR8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixid=M3w0NzAxMzN8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTk1MjR8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1592992584424-bb6c75136025?ixid=M3w0NzAxMzN8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTk1MjV8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1645075960701-573cbc669de6?ixid=M3w0NzAxMzN8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTk1MjV8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1534119768988-c496213eff76?ixid=M3w0NzAxMzN8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTk1MjZ8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1535931737580-a99567967ddc?ixid=M3w0NzAxMzN8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTk1MjZ8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1566847438217-76e82d383f84?ixid=M3w0NzAxMzN8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTk1Mjd8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1542157585-ef20bfcce579?ixid=M3w0NzAxMzN8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTk1Mjd8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1585144860131-245d551c77f6?ixid=M3w0NzAxMzN8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTk1Mjh8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1643297654416-05795d62e39c?ixid=M3w0NzAxMzN8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTk1Mjh8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixid=M3w0NzAxMzN8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTk1Mjl8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1614807547811-4174d3582092?ixid=M3w0NzAxMzN8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTk1Mjl8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1504903271097-d7e7c7f5f7ad?ixid=M3w0NzAxMzN8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTk1MzB8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1542178243-bc20204b769f?ixid=M3w0NzAxMzN8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTk1MzB8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1497994139250-caecb78f9df9?ixid=M3w0NzAxMzN8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTk1MzF8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1564164841584-391b5c7b590c?ixid=M3w0NzAxMzN8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTk1MzF8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1685586784805-8d96eaeaa5ff?ixid=M3w0NzAxMzN8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTk1MzJ8&ixlib=rb-4.0.3",
		"https://images.unsplash.com/photo-1510597026538-da2e86b8588a?ixid=M3w0NzAxMzN8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgzOTk1MzJ8&ixlib=rb-4.0.3",
	];

	return avatarUrls[Math.floor(Math.random() * avatarUrls.length)];
};

const generateRandomChannelName = () => {
	const names = [
		"mystic_rush",
		"storm_haven",
		"elite_force",
		"quantum_net",
		"crimson_sky",
		"nexus_prime",
		"blaze_fury",
		"lunar_echo",
		"terra_nova",
		"radiant_dusk",
	];

	return names[Math.floor(Math.random() * names.length)];
};

const usedNames: string[] = [];
const usedAvatars: string[] = [];
const usedChannelNames: string[] = [];

function getRandomUniqueElements<T>(list: T[], count: number): T[] {
	if (count >= list.length) {
		throw new Error("Count cannot be greater than or equal to the list length");
	}

	const uniqueElements = new Set<T>();
	const result: T[] = [];

	while (uniqueElements.size < count) {
		const randomIndex = Math.floor(Math.random() * list.length);
		const randomElement = list[randomIndex];
		if (!uniqueElements.has(randomElement)) {
			uniqueElements.add(randomElement);
			result.push(randomElement);
		}
	}

	return result;
}

function getRandomElement<T>(list: T[]): T {
	const randomIndex = Math.floor(Math.random() * list.length);
	return list[randomIndex];
}

async function createChannel() {
	let name;

	do {
		name = generateRandomChannelName();
	} while (usedChannelNames.find((x) => x == name));
	usedChannelNames.push(name);

	let members = getRandomUniqueElements(usedNames, 5);
	const owner = getRandomElement(members);
	members = members.filter((x) => owner != x);

	await prisma.channel.upsert({
		where: { name },
		update: {},
		create: {
			name,
			type: "public",
			conversation: {
				create: {
					participants: {
						createMany: {
							data: members.map((x) => ({
								userName: x,
							})),
						},
					},
				},
			},
			channelMembers: {
				createMany: {
					data: [
						{
							userName: owner,
							type: "owner",
						},
						...members.map<Prisma.ChannelMemberCreateManyChannelInput>((x) => ({
							userName: x,
							type: "member",
						})),
					],
				},
			},
		},
	});
}

async function main() {}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
