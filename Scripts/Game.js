function StatVariance(n)
	{
	return n<1e3?Math.floor(n/50)+1:20
}
function RandomInRange(n,t)
	{
	return Math.floor(Math.random()*(t-n+1))+n
}
function CoinFlip()
	{
	return Math.random()<.5?!0:!1
}
function MutationCheck(n,t)
	{
	return n>=10?t>=(n-10)*100+450:t>=n*(n-1)*5
}
function UpgradeCost(n,t)
	{
	return t*Math.pow(10,n-1)
}
function LevelFromXp(n)
	{
	var t=Math.floor((Math.sqrt(4+8*n)-2)/4);
	return t>99?99:t
}
function SmartRound(n)
	{
	return n<100?Math.round(n*10)/10:Math.round(n)
}
function Shuffle(n)
	{
	for(var t=n.length,r,i;
	0!==t;
	)i=Math.floor(Math.random()*t),t-=1,r=n[t],n[t]=n[i],n[i]=r;
	return n
}
var ticksPerSecond=20,game,GameController=function()
	{
	function n()
		{
		this.generations=ko.observable(0);
		this.sorts=["score","base","bonus","vitality","strength","agility","bite","sting","mutations","mine","farm","carry","factory"];
		this.armySorts=["score","vitality","strength","agility","bite","sting","level"];
		this.femaleSort=ko.observable("score");
		this.maleSort=ko.observable("score");
		this.armySort=ko.observable("level");
		this.princessSort=ko.observable("score");
		this.princeSort=ko.observable("score");
		this.newGeneChanceRange=1e3;
		this.traitMax=999999;
		this.geneMax=100;
		this.missNewGene=ko.observable(0);
		this.newGeneChance=ko.computed(function()
			{
			return 10*(1+Math.floor(this.missNewGene()/25*10)/10)
		}
		,this);
		this.newestBorn=ko.observable(0);
		this.pauseBreeding=ko.observable(!1);
		this.carryPerSecondRaw=ko.observable(0);
		this.carryPerSecond=ko.computed(function()
			{
			return SmartRound(this.carryPerSecondRaw())
		}
		,this);
		this.dirtRaw=ko.observable(0);
		this.dirt=ko.computed(function()
			{
			return SmartRound(this.dirtRaw())
		}
		,this);
		this.factoryDirtRaw=ko.observable(0);
		this.factoryDirt=ko.computed(function()
			{
			return SmartRound(this.factoryDirtRaw())
		}
		,this);
		this.dirtPerSecondRaw=ko.observable(0);
		this.dirtPerSecond=ko.computed(function()
			{
			return SmartRound(this.dirtPerSecondRaw())
		}
		,this);
		this.grassRaw=ko.observable(0);
		this.grass=ko.computed(function()
			{
			return SmartRound(this.grassRaw())
		}
		,this);
		this.factoryGrassRaw=ko.observable(0);
		this.factoryGrass=ko.computed(function()
			{
			return SmartRound(this.factoryGrassRaw())
		}
		,this);
		this.grassPerSecondRaw=ko.observable(0);
		this.grassPerSecond=ko.computed(function()
			{
			return SmartRound(this.grassPerSecondRaw())
		}
		,this);
		this.mineDirtPerSecond=ko.observable(0);
		this.carryMineDirtPerSecond=ko.observable(0);
		this.factoryDirtPerSecond=ko.observable(0);
		this.farmGrassPerSecond=ko.observable(0);
		this.carryFarmGrassPerSecond=ko.observable(0);
		this.factoryGrassPerSecond=ko.observable(0);
		this.factorySodPerSecond=ko.observable(0);
		this.sodPerSecondForBreeding=ko.observable(0);
		this.sodRaw=ko.observable(0);
		this.sod=ko.computed(function()
			{
			return SmartRound(this.sodRaw())
		}
		,this);
		this.sodPerSecondRaw=ko.observable(0);
		this.sodPerSecond=ko.computed(function()
			{
			return SmartRound(this.sodPerSecondRaw())
		}
		,this);
		this.mother=ko.observable();
		this.father=ko.observable();
		this.princess=ko.observable();
		this.prince=ko.observable();
		this.sodDedicatedToBreeding=ko.observable(0);
		this.isHeirsUnlocked=ko.observable(!1);
		this.boosts=ko.observable(10);
		this.maxBoosts=ko.observable(10);
		this.maleMound=ko.observableArray([]).extend(
			{
			rateLimit:100
		}
		);
		this.femaleMound=ko.observableArray([]).extend(
			{
			rateLimit:100
		}
		);
		this.princeMound=ko.observableArray([]).extend(
			{
			rateLimit:100
		}
		);
		this.princessMound=ko.observableArray([]).extend(
			{
			rateLimit:100
		}
		);
		this.farmMound=ko.observableArray([]).extend(
			{
			rateLimit:100
		}
		);
		this.mineMound=ko.observableArray([]).extend(
			{
			rateLimit:100
		}
		);
		this.carrierMound=ko.observableArray([]).extend(
			{
			rateLimit:100
		}
		);
		this.factoryMound=ko.observableArray([]).extend(
			{
			rateLimit:100
		}
		);
		this.armyMound=ko.observableArray([]).extend(
			{
			rateLimit:100
		}
		);
		this.maxMaleMoundSize=ko.observable(1);
		this.maleMoundEmpty=ko.computed(function()
			{
			for(var n=[],t=0;
			t<this.maxMaleMoundSize()-this.maleMound().length;
			t++)n.push(null);
			return n
		}
		,this);
		this.maxPrincessMoundSize=ko.observable(1);
		this.princessMoundEmpty=ko.computed(function()
			{
			for(var n=[],t=0;
			t<this.maxPrincessMoundSize()-this.princessMound().length;
			t++)n.push(null);
			return n
		}
		,this);
		this.maxPrinceMoundSize=ko.observable(1);
		this.princeMoundEmpty=ko.computed(function()
			{
			for(var n=[],t=0;
			t<this.maxPrinceMoundSize()-this.princeMound().length;
			t++)n.push(null);
			return n
		}
		,this);
		this.maxFemaleMoundSize=ko.observable(1);
		this.femaleMoundEmpty=ko.computed(function()
			{
			for(var n=[],t=0;
			t<this.maxFemaleMoundSize()-this.femaleMound().length;
			t++)n.push(null);
			return n
		}
		,this);
		this.maxFarmMoundSize=ko.observable(1);
		this.farmMoundEmpty=ko.computed(function()
			{
			for(var n=[],t=0;
			t<this.maxFarmMoundSize()-this.farmMound().length;
			t++)n.push(null);
			return n
		}
		,this);
		this.maxMineMoundSize=ko.observable(1);
		this.mineMoundEmpty=ko.computed(function()
			{
			for(var n=[],t=0;
			t<this.maxMineMoundSize()-this.mineMound().length;
			t++)n.push(null);
			return n
		}
		,this);
		this.maxCarrierMoundSize=ko.observable(1);
		this.carrierMoundEmpty=ko.computed(function()
			{
			for(var n=[],t=0;
			t<this.maxCarrierMoundSize()-this.carrierMound().length;
			t++)n.push(null);
			return n
		}
		,this);
		this.maxFactoryMoundSize=ko.observable(1);
		this.factoryMoundEmpty=ko.computed(function()
			{
			for(var n=[],t=0;
			t<this.maxFactoryMoundSize()-this.factoryMound().length;
			t++)n.push(null);
			return n
		}
		,this);
		this.maxArmyMoundSize=ko.observable(1);
		this.armyMoundEmpty=ko.computed(function()
			{
			for(var n=[],t=0;
			t<this.maxArmyMoundSize()-this.armyMound().length;
			t++)n.push(null);
			return n
		}
		,this);
		this.bonusFarmPercent=ko.observable(0);
		this.farmMoundUpgradeCost=ko.computed(function()
			{
			return UpgradeCost(this.maxFarmMoundSize(),500)
		}
		,this);
		this.bonusMinePercent=ko.observable(0);
		this.mineMoundUpgradeCost=ko.computed(function()
			{
			return UpgradeCost(this.maxMineMoundSize(),500)
		}
		,this);
		this.bonusCarrierPercent=ko.observable(0);
		this.carrierMoundUpgradeCost=ko.computed(function()
			{
			return UpgradeCost(this.maxCarrierMoundSize(),500)
		}
		,this);
		this.bonusFactoryPercent=ko.observable(0);
		this.factoryMoundUpgradeCost=ko.computed(function()
			{
			return UpgradeCost(this.maxFactoryMoundSize(),500)
		}
		,this);
		this.armyMoundUpgradeCost=ko.computed(function()
			{
			return UpgradeCost(this.maxArmyMoundSize(),500)
		}
		,this);
		this.maleMoundUpgradeCost=ko.computed(function()
			{
			return UpgradeCost(this.maxMaleMoundSize(),10)
		}
		,this);
		this.femaleMoundUpgradeCost=ko.computed(function()
			{
			return UpgradeCost(this.maxFemaleMoundSize(),10)
		}
		,this);
		this.princeMoundUpgradeCost=ko.computed(function()
			{
			return UpgradeCost(this.maxPrinceMoundSize(),10)
		}
		,this);
		this.princessMoundUpgradeCost=ko.computed(function()
			{
			return UpgradeCost(this.maxPrincessMoundSize(),10)
		}
		,this);
		this.lowestMiner=ko.computed(function()
			{
			return this.mineMound().length>0?this.mineMound()[this.mineMound().length-1].dirtPerSecond:0
		}
		,this);
		this.lowestFarmer=ko.computed(function()
			{
			return this.farmMound().length>0?this.farmMound()[this.farmMound().length-1].grassPerSecond:0
		}
		,this);
		this.lowestCarrier=ko.computed(function()
			{
			return this.carrierMound().length>0?this.carrierMound()[this.carrierMound().length-1].carryPerSecond:0
		}
		,this);
		this.lowestFactory=ko.computed(function()
			{
			return this.factoryMound().length>0?this.factoryMound()[this.factoryMound().length-1].sodPerSecond:0
		}
		,this);
		this.atWar=ko.observable(!1);
		this.showTreasure=ko.observable(!1);
		this.treasureTitle=ko.observable("");
		this.treasureText=ko.observable("");
		this.battleTurnLength=ko.observable(ticksPerSecond/2);
		this.battleTurnClock=0;
		this.inBattle=ko.observable(!1);
		this.battleDamage=ko.observable(0);
		this.battleAttacker=null;
		this.battleDefender=null;
		this.battleDefenderId=ko.observable(0);
		this.battleAttackerId=ko.observable(0);
		this.battleDefenderTrait=ko.observable(0);
		this.battleAttackerTrait=ko.observable(0);
		this.battleDefenderMound=ko.observableArray();
		this.battleOrder=ko.observableArray();
		this.battleOrderIndex=ko.observable(0);
		this.pauseExplore=ko.observable(!1);
		this.exploreTime=ticksPerSecond*30;
		this.exploreClock=ko.observable(this.exploreTime);
		this.exploreClockPercentage=ko.computed(function()
			{
			return Math.round(1e4-this.exploreClock()/this.exploreTime*1e4)/100+"%"
		}
		,this);
		this.pauseAutoBattle=ko.observable(!1);
		this.autoBattleTime=ticksPerSecond*60;
		this.autoBattleClock=ko.observable(this.autoBattleTime);
		this.autoBattleClockPercentage=ko.computed(function()
			{
			return Math.round(1e4-this.autoBattleClock()/this.autoBattleTime*1e4)/100+"%"
		}
		,this);
		this.map=ko.observable(new GameMap);
		this.nations=ko.observableArray();
		this.nation=ko.observable();
		this.achievements=ko.observableArray();
		this.achievementCounts=[];
		this.achievementsUnlocked=ko.observable(0);
		this.armyUpgrades=ko.observable(new ArmyUpgrades);
		this.achievementCheck=10*ticksPerSecond;
		this.saveCheck=60*ticksPerSecond;
		for(var n=0;
		n<23;
		n++)this.achievementCounts.push(new AchievementCount(n));
		this.mother(this.DefaultCritter(0,0,1));
		this.father(this.DefaultCritter(1,0,1));
		this.mother().CalculateScore();
		this.father().CalculateScore();
		this.princess(this.DefaultCritter(0,0,1));
		this.prince(this.DefaultCritter(1,0,1));
		this.princess().CalculateScore();
		this.prince().CalculateScore();
		this.nations.push(new Nation(15,0,"crickets","balanced",5,50,1,null,1));
		this.nations.push(new Nation(16,0,"ants","balanced",1e3,2e3,4,15,2));
		this.nations.push(new Nation(17,0,"grasshoppers","balanced",15e3,25e3,7,16,3));
		this.nations.push(new Nation(0,4,"gnats","high numbers",50,100,1,15,1));
		this.nations.push(new Nation(2,4,"chiggers","high numbers",2e3,3e3,4,0,2));
		this.nations.push(new Nation(1,4,"ladybugs","high numbers",25e3,5e4,7,2,3));
		this.nations.push(new Nation(5,2,"bees","high sting",100,200,2,0,1));
		this.nations.push(new Nation(3,2,"wasps","high sting",3e3,5e3,5,5,2));
		this.nations.push(new Nation(4,2,"scorpions","high sting",5e4,75e3,8,3,3));
		this.nations.push(new Nation(9,1,"beetles","high bite",200,300,2,5,1));
		this.nations.push(new Nation(10,1,"horseflies","high bite",5e3,7500,5,9,2));
		this.nations.push(new Nation(11,1,"termites","high bite",75e3,1e5,8,10,3));
		this.nations.push(new Nation(12,3,"ticks","high health",300,500,3,9,1));
		this.nations.push(new Nation(13,3,"mosquitoes","high health",7500,1e4,6,12,2));
		this.nations.push(new Nation(14,3,"leeches","high health",1e5,125e3,9,13,3));
		this.nations.push(new Nation(8,5,"centipedes","solo fighter",500,1e3,3,12,1));
		this.nations.push(new Nation(7,5,"praying mantis","solo fighter",1e4,15e3,6,8,2));
		this.nations.push(new Nation(6,5,"tarantulas","solo fighter",125e3,15e4,9,7,3));
		this.nations()[0].isUnlocked(!0);
		this.nation(this.nations()[0]);
		this.achievements.push(new Achievement(0,"Breed 10 Vitality","Breed a critter with a Vitality of 10",10));
		this.achievements.push(new Achievement(0,"Breed 25 Vitality","Breed a critter with a Vitality of 25",25));
		this.achievements.push(new Achievement(0,"Breed 50 Vitality","Breed a critter with a Vitality of 50",50));
		this.achievements.push(new Achievement(0,"Breed 100 Vitality","Breed a critter with a Vitality of 100",100));
		this.achievements.push(new Achievement(0,"Breed 250 Vitality","Breed a critter with a Vitality of 250",250));
		this.achievements.push(new Achievement(0,"Breed 500 Vitality","Breed a critter with a Vitality of 500",500));
		this.achievements.push(new Achievement(0,"Breed 1,000 Vitality","Breed a critter with a Vitality of 1,000",1e3));
		this.achievements.push(new Achievement(0,"Breed 5,000 Vitality","Breed a critter with a Vitality of 5,000",5e3));
		this.achievements.push(new Achievement(0,"Breed 10,000 Vitality","Breed a critter with a Vitality of 10,000",1e4));
		this.achievements.push(new Achievement(0,"Breed 50,000 Vitality","Breed a critter with a Vitality of 50,000",5e4));
		this.achievements.push(new Achievement(0,"Breed 75,000 Vitality","Breed a critter with a Vitality of 75,000",75e3));
		this.achievements.push(new Achievement(0,"Breed 100,000 Vitality","Breed a critter with a Vitality of 100,000",1e5));
		this.achievements.push(new Achievement(1,"Breed 10 Strength","Breed a critter with a Strength of 10",10));
		this.achievements.push(new Achievement(1,"Breed 25 Strength","Breed a critter with a Strength of 25",25));
		this.achievements.push(new Achievement(1,"Breed 50 Strength","Breed a critter with a Strength of 50",50));
		this.achievements.push(new Achievement(1,"Breed 100 Strength","Breed a critter with a Strength of 100",100));
		this.achievements.push(new Achievement(1,"Breed 250 Strength","Breed a critter with a Strength of 250",250));
		this.achievements.push(new Achievement(1,"Breed 500 Strength","Breed a critter with a Strength of 500",500));
		this.achievements.push(new Achievement(1,"Breed 1,000 Strength","Breed a critter with a Strength of 1,000",1e3));
		this.achievements.push(new Achievement(1,"Breed 5,000 Strength","Breed a critter with a Strength of 5,000",5e3));
		this.achievements.push(new Achievement(1,"Breed 10,000 Strength","Breed a critter with a Strength of 10,000",1e4));
		this.achievements.push(new Achievement(1,"Breed 50,000 Strength","Breed a critter with a Strength of 50,000",5e4));
		this.achievements.push(new Achievement(1,"Breed 75,000 Strength","Breed a critter with a Strength of 75,000",75e3));
		this.achievements.push(new Achievement(1,"Breed 100,000 Strength","Breed a critter with a Strength of 100,000",1e5));
		this.achievements.push(new Achievement(2,"Breed 10 Agility","Breed a critter with a Agility of 10",10));
		this.achievements.push(new Achievement(2,"Breed 25 Agility","Breed a critter with a Agility of 25",25));
		this.achievements.push(new Achievement(2,"Breed 50 Agility","Breed a critter with a Agility of 50",50));
		this.achievements.push(new Achievement(2,"Breed 100 Agility","Breed a critter with a Agility of 100",100));
		this.achievements.push(new Achievement(2,"Breed 250 Agility","Breed a critter with a Agility of 250",250));
		this.achievements.push(new Achievement(2,"Breed 500 Agility","Breed a critter with a Agility of 500",500));
		this.achievements.push(new Achievement(2,"Breed 1,000 Agility","Breed a critter with a Agility of 1,000",1e3));
		this.achievements.push(new Achievement(2,"Breed 5,000 Agility","Breed a critter with a Agility of 5,000",5e3));
		this.achievements.push(new Achievement(2,"Breed 10,000 Agility","Breed a critter with a Agility of 10,000",1e4));
		this.achievements.push(new Achievement(2,"Breed 50,000 Agility","Breed a critter with a Agility of 50,000",5e4));
		this.achievements.push(new Achievement(2,"Breed 75,000 Agility","Breed a critter with a Agility of 75,000",75e3));
		this.achievements.push(new Achievement(2,"Breed 100,000 Agility","Breed a critter with a Agility of 100,000",1e5));
		this.achievements.push(new Achievement(3,"Breed 10 Bite","Breed a critter with a Bite of 10",10));
		this.achievements.push(new Achievement(3,"Breed 25 Bite","Breed a critter with a Bite of 25",25));
		this.achievements.push(new Achievement(3,"Breed 50 Bite","Breed a critter with a Bite of 50",50));
		this.achievements.push(new Achievement(3,"Breed 100 Bite","Breed a critter with a Bite of 100",100));
		this.achievements.push(new Achievement(3,"Breed 250 Bite","Breed a critter with a Bite of 250",250));
		this.achievements.push(new Achievement(3,"Breed 500 Bite","Breed a critter with a Bite of 500",500));
		this.achievements.push(new Achievement(3,"Breed 1,000 Bite","Breed a critter with a Bite of 1,000",1e3));
		this.achievements.push(new Achievement(3,"Breed 5,000 Bite","Breed a critter with a Bite of 5,000",5e3));
		this.achievements.push(new Achievement(3,"Breed 10,000 Bite","Breed a critter with a Bite of 10,000",1e4));
		this.achievements.push(new Achievement(3,"Breed 50,000 Bite","Breed a critter with a Bite of 50,000",5e4));
		this.achievements.push(new Achievement(3,"Breed 75,000 Bite","Breed a critter with a Bite of 75,000",75e3));
		this.achievements.push(new Achievement(3,"Breed 100,000 Bite","Breed a critter with a Bite of 100,000",1e5));
		this.achievements.push(new Achievement(4,"Breed 10 Sting","Breed a critter with a Sting of 10",10));
		this.achievements.push(new Achievement(4,"Breed 25 Sting","Breed a critter with a Sting of 25",25));
		this.achievements.push(new Achievement(4,"Breed 50 Sting","Breed a critter with a Sting of 50",50));
		this.achievements.push(new Achievement(4,"Breed 100 Sting","Breed a critter with a Sting of 100",100));
		this.achievements.push(new Achievement(4,"Breed 250 Sting","Breed a critter with a Sting of 250",250));
		this.achievements.push(new Achievement(4,"Breed 500 Sting","Breed a critter with a Sting of 500",500));
		this.achievements.push(new Achievement(4,"Breed 1,000 Sting","Breed a critter with a Sting of 1,000",1e3));
		this.achievements.push(new Achievement(4,"Breed 5,000 Sting","Breed a critter with a Sting of 5,000",5e3));
		this.achievements.push(new Achievement(4,"Breed 10,000 Sting","Breed a critter with a Sting of 10,000",1e4));
		this.achievements.push(new Achievement(4,"Breed 50,000 Sting","Breed a critter with a Sting of 50,000",5e4));
		this.achievements.push(new Achievement(4,"Breed 75,000 Sting","Breed a critter with a Sting of 75,000",75e3));
		this.achievements.push(new Achievement(4,"Breed 100,000 Sting","Breed a critter with a Sting of 100,000",1e5));
		this.achievements.push(new Achievement(13,"Breed 1 Mutation","Breed a critter with 1 Mutation",1));
		this.achievements.push(new Achievement(13,"Breed 2 Mutations","Breed a critter with 2 Mutations",2));
		this.achievements.push(new Achievement(13,"Breed 5 Mutations","Breed a critter with 5 Mutations",5));
		this.achievements.push(new Achievement(13,"Breed 10 Mutations","Breed a critter with 10 Mutations",10));
		this.achievements.push(new Achievement(13,"Breed 15 Mutations","Breed a critter with 15 Mutations",15));
		this.achievements.push(new Achievement(13,"Breed 20 Mutations","Breed a critter with 20 Mutations",20));
		this.achievements.push(new Achievement(13,"Breed 25 Mutations","Breed a critter with 25 Mutations",25));
		this.achievements.push(new Achievement(13,"Breed 50 Mutations","Breed a critter with 50 Mutations",50));
		this.achievements.push(new Achievement(5,"Breed 10 Score","Breed a critter with a Score of 10",10));
		this.achievements.push(new Achievement(5,"Breed 50 Score","Breed a critter with a Score of 50",50));
		this.achievements.push(new Achievement(5,"Breed 100 Score","Breed a critter with a Score of 100",100));
		this.achievements.push(new Achievement(5,"Breed 250 Score","Breed a critter with a Score of 250",250));
		this.achievements.push(new Achievement(5,"Breed 500 Score","Breed a critter with a Score of 500",500));
		this.achievements.push(new Achievement(5,"Breed 1,000 Score","Breed a critter with a Score of 1,000",1e3));
		this.achievements.push(new Achievement(5,"Breed 5,000 Score","Breed a critter with a Score of 5,000",5e3));
		this.achievements.push(new Achievement(5,"Breed 10,000 Score","Breed a critter Score of 10,000",1e4));
		this.achievements.push(new Achievement(5,"Breed 50,000 Score","Breed a critter with a Score of 50,000",5e4));
		this.achievements.push(new Achievement(5,"Breed 75,000 Score","Breed a critter with a Score of 75,000",75e3));
		this.achievements.push(new Achievement(5,"Breed 100,000 Score","Breed a critter with a Score of 100,000",1e5));
		this.achievements.push(new Achievement(7,"Breed 25 Generations","Breed a critter with a Generation of 25",25));
		this.achievements.push(new Achievement(7,"Breed 50 Generations","Breed a critter with a Generation of 50",50));
		this.achievements.push(new Achievement(7,"Breed 100 Generations","Breed a critter with a Generation of 100",100));
		this.achievements.push(new Achievement(7,"Breed 200 Generations","Breed a critter with a Generation of 200",200));
		this.achievements.push(new Achievement(7,"Breed 300 Generations","Breed a critter with a Generation of 300",300));
		this.achievements.push(new Achievement(7,"Breed 500 Generations","Breed a critter with a Generation of 500",500));
		this.achievements.push(new Achievement(7,"Breed 750 Generations","Breed a critter with a Generation of 750",750));
		this.achievements.push(new Achievement(7,"Breed 1,000 Generations","Breed a critter with a Generation of 1,000",1e3));
		this.achievements.push(new Achievement(7,"Breed 1,500 Generations","Breed a critter with a Generation of 1,500",1500));
		this.achievements.push(new Achievement(7,"Breed 2,000 Generations","Breed a critter with a Generation of 2,000",2e3));
		this.achievements.push(new Achievement(6,"Breed 250 Critters","Breed 250 Critters",250));
		this.achievements.push(new Achievement(6,"Breed 500 Critters","Breed 500 Critters",500));
		this.achievements.push(new Achievement(6,"Breed 1,000 Critters","Breed 1,000 Critters",1e3));
		this.achievements.push(new Achievement(6,"Breed 2,000 Critters","Breed 2,000 Critters",2e3));
		this.achievements.push(new Achievement(6,"Breed 3,000 Critters","Breed 3,000 Critters",3e3));
		this.achievements.push(new Achievement(6,"Breed 5,000 Critters","Breed 5,000 Critters",5e3));
		this.achievements.push(new Achievement(6,"Breed 7,500 Critters","Breed 7,500 Critters",7500));
		this.achievements.push(new Achievement(6,"Breed 10,000 Critters","Breed 10,000 Critters",1e4));
		this.achievements.push(new Achievement(6,"Breed 15,000 Critters","Breed 15,000 Critters",15e3));
		this.achievements.push(new Achievement(6,"Breed 20,000 Critters","Breed 20,000 Critters",2e4));
		this.achievements.push(new Achievement(6,"Breed 50,000 Critters","Breed 50,000 Critters",2e4));
		this.achievements.push(new Achievement(9,"Mine 5 Dirt/sec","Mine Dirt/sec of 5",5));
		this.achievements.push(new Achievement(9,"Mine 10 Dirt/sec","Mine Dirt/sec of 10",10));
		this.achievements.push(new Achievement(9,"Mine 100 Dirt/sec","Mine Dirt/sec of 100",100));
		this.achievements.push(new Achievement(9,"Mine 500 Dirt/sec","Mine Dirt/sec of 500",500));
		this.achievements.push(new Achievement(9,"Mine 1,000 Dirt/sec","MiMine Dirt/sec of 1,000",1e3));
		this.achievements.push(new Achievement(9,"Mine 2,500 Dirt/sec","Mine Dirt/sec of 2,500",2500));
		this.achievements.push(new Achievement(9,"Mine 5,000 Dirt/sec","Mine Dirt/sec of 5,000",5e3));
		this.achievements.push(new Achievement(9,"Mine 10,000 Dirt/sec","Mine Dirt/sec of 10,000",1e4));
		this.achievements.push(new Achievement(9,"Mine 50,000 Dirt/sec","Mine Dirt/sec of 50,000",5e4));
		this.achievements.push(new Achievement(9,"Mine 100,000 Dirt/sec","Mine Dirt/sec of 100,000",1e5));
		this.achievements.push(new Achievement(9,"Mine 200,000 Dirt/sec","Mine Dirt/sec of 200,000",2e5));
		this.achievements.push(new Achievement(9,"Mine 300,000 Dirt/sec","Mine Dirt/sec of 300,000",3e5));
		this.achievements.push(new Achievement(9,"Mine 500,000 Dirt/sec","Mine Dirt/sec of 500,000",5e5));
		this.achievements.push(new Achievement(15,"Farm 5 Grass/sec","Farm Grass/sec of 5",5));
		this.achievements.push(new Achievement(15,"Farm 10 Grass/sec","Farm Grass/sec of 10",10));
		this.achievements.push(new Achievement(15,"Farm 100 Grass/sec","Farm Grass/sec of 100",100));
		this.achievements.push(new Achievement(15,"Farm 500 Grass/sec","Farm Grass/sec of 500",500));
		this.achievements.push(new Achievement(15,"Farm 1,000 Grass/sec","MiFarm Grass/sec of 1,000",1e3));
		this.achievements.push(new Achievement(15,"Farm 2,500 Grass/sec","Farm Grass/sec of 2,500",2500));
		this.achievements.push(new Achievement(15,"Farm 5,000 Grass/sec","Farm Grass/sec of 5,000",5e3));
		this.achievements.push(new Achievement(15,"Farm 10,000 Grass/sec","Farm Grass/sec of 10,000",1e4));
		this.achievements.push(new Achievement(15,"Farm 50,000 Grass/sec","Farm Grass/sec of 50,000",5e4));
		this.achievements.push(new Achievement(15,"Farm 100,000 Grass/sec","Farm Grass/sec of 100,000",1e5));
		this.achievements.push(new Achievement(15,"Farm 200,000 Grass/sec","Farm Grass/sec of 200,000",2e5));
		this.achievements.push(new Achievement(15,"Farm 300,000 Grass/sec","Farm Grass/sec of 300,000",3e5));
		this.achievements.push(new Achievement(15,"Farm 500,000 Grass/sec","Farm Grass/sec of 500,000",5e5));
		this.achievements.push(new Achievement(16,"Produce 5 Sod/sec","Produce Sod/sec of 5",5));
		this.achievements.push(new Achievement(16,"Produce 10 Sod/sec","Produce Sod/sec of 10",10));
		this.achievements.push(new Achievement(16,"Produce 100 Sod/sec","Produce Sod/sec of 100",100));
		this.achievements.push(new Achievement(16,"Produce 500 Sod/sec","Produce Sod/sec of 500",500));
		this.achievements.push(new Achievement(16,"Produce 1,000 Sod/sec","MiProduce Sod/sec of 1,000",1e3));
		this.achievements.push(new Achievement(16,"Produce 2,500 Sod/sec","Produce Sod/sec of 2,500",2500));
		this.achievements.push(new Achievement(16,"Produce 5,000 Sod/sec","Produce Sod/sec of 5,000",5e3));
		this.achievements.push(new Achievement(16,"Produce 10,000 Sod/sec","Produce Sod/sec of 10,000",1e4));
		this.achievements.push(new Achievement(16,"Produce 50,000 Sod/sec","Produce Sod/sec of 50,000",5e4));
		this.achievements.push(new Achievement(16,"Produce 100,000 Sod/sec","Produce Sod/sec of 100,000",1e5));
		this.achievements.push(new Achievement(16,"Produce 200,000 Sod/sec","Produce Sod/sec of 200,000",2e5));
		this.achievements.push(new Achievement(16,"Produce 300,000 Sod/sec","Produce Sod/sec of 300,000",3e5));
		this.achievements.push(new Achievement(16,"Produce 500,000 Sod/sec","Produce Sod/sec of 500,000",5e5));
		this.achievements.push(new Achievement(8,"Win 50 Battles","Win 50 Battles",50));
		this.achievements.push(new Achievement(8,"Win 100 Battles","Win 100 Battles",100));
		this.achievements.push(new Achievement(8,"Win 250 Battles","Win 250 Battles",250));
		this.achievements.push(new Achievement(8,"Win 500 Battles","Win 500 Battles",500));
		this.achievements.push(new Achievement(8,"Win 1,000 Battles","Win 1,000 Battles",1e3));
		this.achievements.push(new Achievement(8,"Win 2,000 Battles","Win 2,000 Battles",2e3));
		this.achievements.push(new Achievement(8,"Win 3,000 Battles","Win 3,000 Battles",3e3));
		this.achievements.push(new Achievement(8,"Win 5,000 Battles","Win 5,000 Battles",5e3));
		this.achievements.push(new Achievement(8,"Win 7,500 Battles","Win 7,500 Battles",7500));
		this.achievements.push(new Achievement(8,"Win 10,000 Battles","Win 10,000 Battles",1e4));
		this.achievements.push(new Achievement(10,"Find 1 Mine","Find 1 Mine",1));
		this.achievements.push(new Achievement(10,"Find 3 Mines","Find 3 Mines",3));
		this.achievements.push(new Achievement(10,"Find 6 Mines","Find 6 Mines",6));
		this.achievements.push(new Achievement(10,"Find 9 Mines","Find 9 Mines",9));
		this.achievements.push(new Achievement(10,"Find 12 Mines","Find 12 Mines",12));
		this.achievements.push(new Achievement(10,"Find 15 Mines","Find 15 Mines",15));
		this.achievements.push(new Achievement(10,"Find 18 Mines","Find 18 Mines",18));
		this.achievements.push(new Achievement(18,"Find 1 Farm","Find 1 Farm",1));
		this.achievements.push(new Achievement(18,"Find 3 Farms","Find 3 Farms",3));
		this.achievements.push(new Achievement(18,"Find 6 Farms","Find 6 Farms",6));
		this.achievements.push(new Achievement(18,"Find 9 Farms","Find 9 Farms",9));
		this.achievements.push(new Achievement(18,"Find 12 Farms","Find 12 Farms",12));
		this.achievements.push(new Achievement(18,"Find 15 Farms","Find 15 Farms",15));
		this.achievements.push(new Achievement(18,"Find 18 Farms","Find 18 Farms",18));
		this.achievements.push(new Achievement(19,"Find 1 Equipment","Find 1 Equipment",1));
		this.achievements.push(new Achievement(19,"Find 3 Equipment","Find 3 Equipment",3));
		this.achievements.push(new Achievement(19,"Find 6 Equipment","Find 6 Equipment",6));
		this.achievements.push(new Achievement(19,"Find 9 Equipment","Find 9 Equipment",9));
		this.achievements.push(new Achievement(19,"Find 12 Equipment","Find 12 Equipment",12));
		this.achievements.push(new Achievement(19,"Find 15 Equipment","Find 15 Equipment",15));
		this.achievements.push(new Achievement(19,"Find 18 Equipment","Find 18 Equipment",18));
		this.achievements.push(new Achievement(20,"Find 1 Factory","Find 1 Factory",1));
		this.achievements.push(new Achievement(20,"Find 3 Factories","Find 3 Factories",3));
		this.achievements.push(new Achievement(20,"Find 6 Factories","Find 6 Factories",6));
		this.achievements.push(new Achievement(20,"Find 9 Factories","Find 9 Factories",9));
		this.achievements.push(new Achievement(20,"Find 12 Factories","Find 12 Factories",12));
		this.achievements.push(new Achievement(20,"Find 15 Factories","Find 15 Factories",15));
		this.achievements.push(new Achievement(20,"Find 18 Factories","Find 18 Factories",18));
		this.achievements.push(new Achievement(11,"Find 1 Enemy Gene","Find 1 Enemy Gene",1));
		this.achievements.push(new Achievement(11,"Find 3 Enemy Genes","Find 3 Enemy Genes",3));
		this.achievements.push(new Achievement(11,"Find 6 Enemy Genes","Find 6 Enemy Genes",6));
		this.achievements.push(new Achievement(11,"Find 9 Enemy Genes","Find 9 Enemy Genes",9));
		this.achievements.push(new Achievement(11,"Find 12 Enemy Genes","Find 12 Enemy Genes",12));
		this.achievements.push(new Achievement(11,"Find 15 Enemy Genes","Find 15 Enemy Genes",15));
		this.achievements.push(new Achievement(11,"Find 18 Enemy Genes","Find 18 Enemy Genes",18));
		this.achievements.push(new Achievement(12,"Find 1 High Ground","Find 1 High Ground",1));
		this.achievements.push(new Achievement(12,"Find 3 High Ground","Find 3 High Ground",3));
		this.achievements.push(new Achievement(12,"Find 6 High Ground","Find 6 High Ground",6));
		this.achievements.push(new Achievement(12,"Find 9 High Ground","Find 9 High Ground",9));
		this.achievements.push(new Achievement(12,"Find 12 High Ground","Find 12 High Ground",12));
		this.achievements.push(new Achievement(12,"Find 15 High Ground","Find 15 High Ground",15));
		this.achievements.push(new Achievement(12,"Find 18 High Ground","Find 18 High Ground",18));
		this.achievements.push(new Achievement(14,"Find 1 Boost Upgrade","Find 1 Boost Upgrade",1));
		this.achievements.push(new Achievement(14,"Find 3 Boost Upgrades","Find 3 Boost Upgrades",3));
		this.achievements.push(new Achievement(14,"Find 6 Boost Upgrades","Find 6 Boost Upgrades",6));
		this.achievements.push(new Achievement(14,"Find 9 Boost Upgrades","Find 9 Boost Upgrades",9));
		this.achievements.push(new Achievement(14,"Find 12 Boost Upgrades","Find 12 Boost Upgrades",12));
		this.achievements.push(new Achievement(14,"Find 15 Boost Upgrades","Find 15 Boost Upgrades",15));
		this.achievements.push(new Achievement(14,"Find 18 Boost Upgrades","Find 18 Boost Upgrades",18));
		this.achievements.push(new Achievement(21,"Complete 1 Map","Finish 1 Map 100%",1));
		this.achievements.push(new Achievement(21,"Complete 3 Maps","Finish 3 Maps 100%",3));
		this.achievements.push(new Achievement(21,"Complete 6 Maps","Finish 6 Maps 100%",6));
		this.achievements.push(new Achievement(21,"Complete 9 Maps","Finish 9 Maps 100%",9));
		this.achievements.push(new Achievement(21,"Complete 12 Maps","Finish 12 Maps 100%",12));
		this.achievements.push(new Achievement(21,"Complete 15 Maps","Finish 15 Maps 100%",15));
		this.achievements.push(new Achievement(21,"Complete 18 Maps","Finish 18 Maps 100%",18));
		this.achievements.push(new Achievement(22,"Find 1 Fort","Find 1 Fort",1));
		this.achievements.push(new Achievement(22,"Find 3 Forts","Find 3 Forts",3));
		this.achievements.push(new Achievement(22,"Find 6 Forts","Find 6 Forts",6));
		this.achievements.push(new Achievement(22,"Find 9 Forts","Find 9 Forts",9));
		this.achievements.push(new Achievement(22,"Find 12 Forts","Find 12 Forts",12));
		this.achievements.push(new Achievement(22,"Find 15 Forts","Find 15 Forts",15));
		this.achievements.push(new Achievement(22,"Find 18 Forts","Find 18 Forts",18))
	}
	return n.prototype.Tick=function()
		{
		this.BreedCheck(!1);
		this.AutoBattle();
		this.Explore();
		this.Battle();
		this.CalculateProduction();
		this.CheckAchievements();
		this.CheckSave()
	}
	,n.prototype.UpdateProduction=function()
		{
		for(var t,i,r,u=0,n=0;
		n<this.farmMound().length;
		n++)u+=this.farmMound()[n].grassPerSecond;
		for(this.grassPerSecondRaw(u*(1+this.bonusFarmPercent()/100)),this.achievementCounts[15].Update(this.grassPerSecondRaw()),t=0,n=0;
		n<this.mineMound().length;
		n++)t+=this.mineMound()[n].dirtPerSecond;
		for(this.dirtPerSecondRaw(t*(1+this.bonusMinePercent()/100)),this.achievementCounts[9].Update(this.dirtPerSecondRaw()),i=0,n=0;
		n<this.carrierMound().length;
		n++)i+=this.carrierMound()[n].carryPerSecond;
		for(this.carryPerSecondRaw(i*(1+this.bonusCarrierPercent()/100)),this.achievementCounts[17].Update(this.carryPerSecondRaw()),r=0,n=0;
		n<this.factoryMound().length;
		n++)r+=this.factoryMound()[n].sodPerSecond;
		this.sodPerSecondRaw(r*(1+this.bonusFactoryPercent()/100));
		this.achievementCounts[16].Update(this.sodPerSecondRaw())
	}
	,n.prototype.CalculateProduction=function()
		{
		var t,i,n,r;
		this.dirtRaw(this.dirtRaw()+this.dirtPerSecondRaw()/ticksPerSecond);
		this.grassRaw(this.grassRaw()+this.grassPerSecondRaw()/ticksPerSecond);
		t=this.carryPerSecondRaw()/ticksPerSecond;
		t>this.dirtRaw()&&(t=this.dirtRaw());
		this.dirtRaw(this.dirtRaw()-t);
		this.factoryDirtRaw(this.factoryDirtRaw()+t);
		i=this.carryPerSecondRaw()/ticksPerSecond;
		i>this.grassRaw()&&(i=this.grassRaw());
		this.grassRaw(this.grassRaw()-i);
		this.factoryGrassRaw(this.factoryGrassRaw()+i);
		n=this.sodPerSecondRaw()/ticksPerSecond;
		r=Math.min(this.factoryDirtRaw(),this.factoryGrassRaw());
		n>r&&(n=r);
		n>0&&(this.factoryDirtRaw(this.factoryDirtRaw()-n),this.factoryGrassRaw(this.factoryGrassRaw()-n),this.sodRaw(this.sodRaw()+n));
		this.carryMineDirtPerSecond(SmartRound(this.dirtRaw()>this.carryPerSecond()?this.carryPerSecondRaw():this.dirtPerSecondRaw()));
		this.carryFarmGrassPerSecond(SmartRound(this.grassRaw()>this.carryPerSecond()?this.carryPerSecondRaw():this.grassPerSecondRaw()));
		this.mineDirtPerSecond(SmartRound(this.dirtPerSecondRaw()-this.carryMineDirtPerSecond()));
		this.farmGrassPerSecond(SmartRound(this.grassPerSecondRaw()-this.carryFarmGrassPerSecond()));
		this.factoryDirtRaw()>this.sodPerSecondRaw()&&this.factoryGrassRaw()>this.sodPerSecondRaw()?this.factorySodPerSecond(SmartRound(this.sodPerSecondRaw())):this.factoryDirtRaw()>this.sodPerSecondRaw()?this.factorySodPerSecond(SmartRound(this.carryFarmGrassPerSecond())):this.factoryGrassRaw()>this.sodPerSecondRaw()?this.factorySodPerSecond(SmartRound(this.carryMineDirtPerSecond())):this.factorySodPerSecond(SmartRound(Math.min(this.carryMineDirtPerSecond(),this.carryFarmGrassPerSecond())));
		this.factoryDirtPerSecond(SmartRound(this.carryMineDirtPerSecond()-this.factorySodPerSecond()));
		this.factoryGrassPerSecond(SmartRound(this.carryFarmGrassPerSecond()-this.factorySodPerSecond()));
		this.sodPerSecondForBreeding(SmartRound(this.factorySodPerSecond()*(this.sodDedicatedToBreeding()/100)));
		this.AnimateWorkers()
	}
	,n.prototype.BreedCheck=function(n)
		{
		if(n||this.father().currentHealth()>=this.father().health&&this.mother().currentHealth()>=this.mother().health?(this.Breed(this.mother(),this.father(),"Royal"),!n&&this.boosts()<this.maxBoosts()&&this.boosts(Math.round((this.boosts()+.1)*10)/10)):this.pauseBreeding()||(this.mother().currentHealth(this.mother().currentHealth()+this.mother().health/this.mother().actionTime),this.father().currentHealth(this.father().currentHealth()+this.father().health/this.father().actionTime)),this.prince().currentHealth()>=this.prince().health&&this.princess().currentHealth()>=this.princess().health)this.Breed(this.princess(),this.prince(),"Heir");
		else if(this.sodDedicatedToBreeding()>0)
			{
			var r=this.sodRaw()/ticksPerSecond>this.sodPerSecondForBreeding()/ticksPerSecond?this.sodPerSecondForBreeding()/ticksPerSecond:this.sodRaw()/ticksPerSecond,t=this.princess().score*5,i=this.prince().score*5;
			this.prince().currentHealth()<this.prince().health&&this.princess().currentHealth()<this.princess().health?(t=t/r*2,i=i/r*2,this.princess().currentHealth(this.princess().currentHealth()+this.princess().health/t),this.prince().currentHealth(this.prince().currentHealth()+this.prince().health/i)):this.prince().currentHealth()<this.prince().health?(i=i/r,this.prince().currentHealth(this.prince().currentHealth()+this.prince().health/i)):(t=t/r,this.princess().currentHealth(this.princess().currentHealth()+this.princess().health/t));
			this.prince().currentHealth()<0&&this.prince().currentHealth(0);
			this.princess().currentHealth()<0&&this.princess().currentHealth(0);
			this.sodRaw(this.sodRaw()-r)
		}
	}
	,n.prototype.Breed=function(n,t,i)
		{
		var c,y,u,l,f,h,a,v,s,p,e,o,r;
		for(n.currentHealth(0),t.currentHealth(0),c=n.generation>t.generation?n.generation+1:t.generation+1,c>this.generations()&&this.generations(c),this.achievementCounts[7].Update(this.generations()),y=CoinFlip()?0:1,u=this.DefaultCritter(y,1,c),r=0;
		r<n.traits.length;
		r++)
			{
			for(u.traits[r].base=n.traits[r].base>=this.traitMax&&t.traits[r].base>=this.traitMax?this.traitMax:this.MutateStat(n.traits[r].base,t.traits[r].base,1,this.traitMax),l=0;
			l<n.traits[r].genes.length;
			l++)f=n.traits[r].genes[l],h=jQuery.grep(t.traits[r].genes,function(n)
				{
				return n.id==f.id
			}
			),h.length==1?(e=this.CalculateExpression(h[0].expression,f.expression),e!=0&&(a=0,f.value>=this.geneMax&&h[0].value>=this.geneMax?a=this.geneMax:e==2&&(a=this.MutateStat(f.value,h[0].value,f.good?1:0,this.geneMax)),o=new Gene(f.id,f.trait,e,f.name,a,f.good),o.value==0&&(o.expression=1),u.traits[r].genes.push(o))):(e=this.CalculateExpression(0,f.expression),e!=0&&(o=new Gene(f.id,f.trait,1,f.name,0,f.good),u.traits[r].genes.push(o)));
			for(v=0;
			v<t.traits[r].genes.length;
			v++)s=t.traits[r].genes[v],p=jQuery.grep(n.traits[r].genes,function(n)
				{
				return n.id==s.id
			}
			),p.length==0&&(e=this.CalculateExpression(0,s.expression),e!=0&&(o=new Gene(s.id,s.trait,e,s.name,0,s.good),u.traits[r].genes.push(o)));
			u.traits[r].genes.sort(function(n,t)
				{
				return t.value-n.value
			}
			)
		}
		for(u.CalculateScore(),this.NewGene(u),r=0;
		r<u.traits.length;
		r++)this.achievementCounts[r].Update(u.traits[r].value);
		this.achievementCounts[5].Update(u.score);
		this.achievementCounts[13].Update(u.totalMutations);
		i=="Royal"?u.gender==1?this.maleMound.unshift(u):this.femaleMound.unshift(u):(i="Heirs")&&(u.job=5,u.gender==1?this.princeMound.unshift(u):this.princessMound.unshift(u));
		this.newestBorn(u.id);
		this.Sort()
	}
	,n.prototype.NewGene=function(n)
		{
		var e=RandomInRange(1,this.newGeneChanceRange),r,i,t,f,u;
		if(e<=this.newGeneChance())for(this.missNewGene(0),r=!1,i=0;
		i<availableGenes.length;
		i++)
			{
			if(r)break;
			if(t=availableGenes[i],f=jQuery.grep(n.traits[t.trait].genes,function(n)
				{
				return n.id==t.id
			}
			),f.length==0)
				{
				var o=n.traits[t.trait].base,s=n.traits[t.trait].bonus,h=n.traits[t.trait].genes.length+1;
				o>25&&MutationCheck(h,s)&&(u=new Gene(t.id,t.trait,1,t.name,t.value,t.good),u.mutation=!0,n.traits[t.trait].genes.push(u),n.traits[t.trait].mutation=!0,n.CalculateScore(),r=!0)
			}
		}
		else this.missNewGene(this.missNewGene()+1)
	}
	,n.prototype.TogglePauseBreeding=function()
		{
		this.pauseBreeding(!this.pauseBreeding())
	}
	,n.prototype.TogglePauseExplore=function()
		{
		this.pauseExplore(!this.pauseExplore())
	}
	,n.prototype.TogglePauseAutoBattle=function()
		{
		this.pauseAutoBattle(!this.pauseAutoBattle())
	}
	,n.prototype.Select=function(n)
		{
		if(n.isLocked())
			{
			$(".tabcontents").notify("Shift click to unlock that critter","Info");
			return
		}
		n.job!=1&&n.job!=5&&n.job!=2&&(n.job!=3||this.inBattle())||n.isSelected(!n.isSelected())
	}
	,n.prototype.Lock=function(n)
		{
		n.job==1&&(n.isSelected(!1),n.isLocked(!n.isLocked()))
	}
	,n.prototype.Move=function(n,t,i,r)
		{
		var f,o,l,a,p,e,u;
		switch(t)
			{
			case"Male":f=this.maleMound;
			break;
			case"Female":f=this.femaleMound;
			break;
			case"Prince":f=this.princeMound;
			break;
			case"Princess":f=this.princessMound;
			break;
			case"Mine":f=this.mineMound;
			break;
			case"Farm":f=this.farmMound;
			break;
			case"Carrier":f=this.carrierMound;
			break;
			case"Factory":f=this.factoryMound;
			break;
			case"Army":f=this.armyMound
		}
		if(o=r.shiftKey||r.ctrlKey?f.removeAll():f.remove(function(n)
			{
			return n.isSelected()
		}
		),o.length==0&&(o=[f.shift()]),o[0]==undefined)
			{
			$(".tabcontents").notify("The mound is empty","Info");
			return
		}
		switch(n)
			{
			case"Mate":case"MateYoung":for(e=0;
			e<o.length;
			e++)
				{
				if(e>0)
					{
					o[e].isSelected(!1);
					f.unshift(o[e]);
					continue
				}
				if(u=o[e],u.isLocked())
					{
					f.unshift(u);
					$(".tabcontents").notify("Shift click to unlock that critter","Info");
					continue
				}
				u.job=0;
				u.isSelected(!1);
				u.gender==0&&n=="Mate"?(this.mother(u),this.mother().currentHealth(0)):u.gender==1&&n=="Mate"?(this.father(u),this.father().currentHealth(0)):u.gender==0&&n=="MateYoung"?(l=this.princess().currentHealth()/this.princess().health*this.princess().score,this.princess(u),this.princess().currentHealth(l/this.princess().score*5*this.princess().health)):u.gender==1&&n=="MateYoung"&&(a=this.prince().currentHealth()/this.prince().health*this.prince().score,this.prince(u),this.prince().currentHealth(a/this.prince().score*5*this.prince().health));
				this.Sort()
			}
			break;
			case"Worker":for(e=0;
			e<o.length;
			e++)
				{
				if(u=o[e],u.isLocked())
					{
					f.unshift(u);
					$(".tabcontents").notify("Shift click to unlock that critter","Info");
					continue
				}
				u.job=2;
				u.isSelected(!1);
				f.remove(u);
				var h=u.dirtPerSecond>this.lowestMiner()||this.mineMound().length<this.maxMineMoundSize(),c=u.grassPerSecond>this.lowestFarmer()||this.farmMound().length<this.maxFarmMoundSize(),v=u.carryPerSecond>this.lowestCarrier()||this.carrierMound().length<this.maxCarrierMoundSize(),y=u.sodPerSecond>this.lowestFactory()||this.factoryMound().length<this.maxFactoryMoundSize(),s=Math.min(this.dirtPerSecondRaw(),this.grassPerSecondRaw(),this.carryPerSecondRaw(),this.sodPerSecondRaw());
				h&&s==this.dirtPerSecondRaw()?this.mineMound.unshift(u):c&&s==this.grassPerSecondRaw()?this.farmMound.unshift(u):v&&s==this.carryPerSecondRaw()?this.carrierMound.unshift(u):y&&s==this.sodPerSecondRaw()?this.factoryMound.unshift(u):h&&c?(p=Math.min(this.dirtPerSecondRaw(),this.grassPerSecondRaw()),p==this.dirtPerSecondRaw()?this.mineMound.unshift(u):this.farmMound.unshift(u)):h?this.mineMound.unshift(u):c?this.farmMound.unshift(u):v?this.carrierMound.unshift(u):y&&this.factoryMound.unshift(u);
				this.Sort();
				this.UpdateProduction()
			}
			break;
			case"Army":for(e=0;
			e<o.length;
			e++)
				{
				if(u=o[e],u.isLocked())
					{
					f.unshift(u);
					$(".tabcontents").notify("Shift click to unlock that critter","Info");
					continue
				}
				u.isSelected(!1);
				u.job=3;
				f.remove(u);
				this.armyMound.unshift(u)
			}
			this.Sort();
			this.UpdateArmyUpgrades();
			break;
			case"Recycle":for(e=0;
			e<o.length;
			e++)
				{
				if(u=o[e],u.isLocked())
					{
					f.unshift(u);
					$(".tabcontents").notify("Shift click to unlock that critter","Info");
					continue
				}
				f.remove(u)
			}
			this.UpdateProduction();
			this.UpdateArmyUpgrades()
		}
		this.newestBorn(0)
	}
	,n.prototype.Boost=function()
		{
		this.boosts()<1||(this.boosts(Math.round((this.boosts()-1)*10)/10),this.BreedCheck(!0))
	}
	,n.prototype.Buy=function(n,t)
		{
		return this.sodRaw()>=n?(this.sodRaw(this.sodRaw()-n),!0):($(".tabcontents").notify("Not enough sod to build upgrade to the "+t+" Mound","Info"),!1)
	}
	,n.prototype.Upgrade=function(n)
		{
		switch(n)
			{
			case"FemaleHatchery":if(this.maxFemaleMoundSize()>=10)return;
			this.Buy(this.femaleMoundUpgradeCost(),"Female Hatchery Upgrade")&&this.maxFemaleMoundSize(this.maxFemaleMoundSize()+1);
			break;
			case"MaleHatchery":if(this.maxMaleMoundSize()>=10)return;
			this.Buy(this.maleMoundUpgradeCost(),"Male Hatchery Upgrade")&&this.maxMaleMoundSize(this.maxMaleMoundSize()+1);
			break;
			case"PrinceHatchery":if(this.maxPrinceMoundSize()>=10)return;
			this.Buy(this.princeMoundUpgradeCost(),"Prince Hatchery Upgrade")&&this.maxPrinceMoundSize(this.maxPrinceMoundSize()+1);
			break;
			case"PrincessHatchery":if(this.maxPrincessMoundSize()>=10)return;
			this.Buy(this.princessMoundUpgradeCost(),"Princess Hatchery Upgrade")&&this.maxPrincessMoundSize(this.maxPrincessMoundSize()+1);
			break;
			case"Mine":if(this.maxMineMoundSize()>=10)return;
			this.Buy(this.mineMoundUpgradeCost(),"Mine Upgrade")&&this.maxMineMoundSize(this.maxMineMoundSize()+1);
			break;
			case"Farm":if(this.maxFarmMoundSize()>=10)return;
			this.Buy(this.farmMoundUpgradeCost(),"Farm Upgrade")&&this.maxFarmMoundSize(this.maxFarmMoundSize()+1);
			break;
			case"Carrier":if(this.maxCarrierMoundSize()>=10)return;
			this.Buy(this.carrierMoundUpgradeCost(),"Carrier Upgrade")&&this.maxCarrierMoundSize(this.maxCarrierMoundSize()+1);
			break;
			case"Factory":if(this.maxFactoryMoundSize()>=10)return;
			this.Buy(this.factoryMoundUpgradeCost(),"Factory Upgrade")&&this.maxFactoryMoundSize(this.maxFactoryMoundSize()+1);
			break;
			case"Army":if(this.maxArmyMoundSize()>=10)return;
			this.Buy(this.armyMoundUpgradeCost(),"Barracks Upgrade")&&this.maxArmyMoundSize(this.maxArmyMoundSize()+1)
		}
	}
	,n.prototype.StartWar=function(n)
		{
		this.map(new GameMap);
		this.nation(n);
		this.map().nation=n;
		this.map().Generate(20,20);
		this.atWar(!0);
		this.exploreClock(0);
		this.armyUpgrades(new ArmyUpgrades);
		this.UpdateArmyUpgrades();
		this.Save()
	}
	,n.prototype.EndWar=function()
		{
		var t=this.nation().mapComplete()?this.nation().mapComplete():confirm("Are you sure you want to end this war?  You haven't finished this map yet and you'll have to start over."),n;
		if(t)
			{
			if(this.atWar(!1),this.nation().isDefeated())for(n=0;
			n<this.nations().length;
			n++)this.nations()[n].requiredToUnlock==this.nation().enemy&&this.nations()[n].isUnlocked(!0);
			this.map().tiles([]);
			this.armyUpgrades(new ArmyUpgrades);
			this.Save()
		}
	}
	,n.prototype.MapSelect=function(n)
		{
		n.isUnlocked()&&!n.isCleared()&&(this.map().currentBattle=n.coords,this.StartBattle())
	}
	,n.prototype.StartBattle=function()
		{
		var n,t;
		if(this.armyMound().length==0)
			{
			$(".tabcontents").notify("You should assign some soldiers to the barracks before starting a fight","error");
			return
		}
		for(this.showTreasure(!1),this.inBattle(!0),this.map().CreateArmy(),n=0;
		n<this.armyMound().length;
		n++)t=new BattleMoundIndex(this.armyMound()[n].id,!0,n,this.armyMound()[n].actionTime),this.battleOrder.push(t);
		for(n=0;
		n<this.map().enemyArmyMound().length;
		n++)t=new BattleMoundIndex(this.map().enemyArmyMound()[n].id,!1,n,this.map().enemyArmyMound()[n].actionTime),this.battleOrder.push(t);
		this.battleOrder.sort(function(n,t)
			{
			return n.speed==t.speed?0:n.speed>t.speed?1:-1
		}
		)
	}
	,n.prototype.Battle=function()
		{
		var f,e,h,r,o,p,c,i,t,u,b,s,w,n;
		if(this.inBattle())if(this.battleTurnClock<=0)
			{
			if(this.battleAttackerMoundIndex=this.battleOrder()[this.battleOrderIndex()],this.battleOrderIndex(this.battleOrderIndex()<this.battleOrder().length-1?this.battleOrderIndex()+1:0),this.battleAttackerMoundIndex==undefined)return;
			if(this.battleAttackerMoundIndex.isPlayer?(this.battleDefenderMound=this.map().enemyArmyMound,this.battleAttacker=this.armyMound()[this.battleAttackerMoundIndex.index]):(this.battleDefenderMound=this.armyMound,this.battleAttacker=this.map().enemyArmyMound()[this.battleAttackerMoundIndex.index]),this.battleAttacker.currentHealth()<=0)return;
			if(this.battleAttackerId(this.battleAttacker.id),f=jQuery.grep(this.battleDefenderMound(),function(n)
				{
				return n.currentHealth()>0
			}
			),f.length>0)
				{
				if(this.battleDefender=f[RandomInRange(0,f.length-1)],this.battleDefenderId(this.battleDefender.id),r=0,o=1,this.battleAttackerMoundIndex.isPlayer&&RandomInRange(1,100)<=this.battleAttacker.level()&&(o=2),CoinFlip())
					{
					var l=this.battleAttackerMoundIndex.isPlayer?this.battleAttacker.traits[3].value*(1+this.armyUpgrades().biteBonus()/100):this.battleAttacker.traits[3].value,a=this.battleAttackerMoundIndex.isPlayer?this.battleDefender.traits[4].value:this.battleDefender.traits[4].value*(1+this.armyUpgrades().stingBonus()/100),v=this.battleAttackerMoundIndex.isPlayer?this.battleAttacker.strengthBonus*(1+this.armyUpgrades().strengthBonus()/100):this.battleAttacker.strengthBonus,y=this.battleAttackerMoundIndex.isPlayer?this.battleDefender.agilityBonus:this.battleDefender.agilityBonus*(1+this.armyUpgrades().agilityBonus()/100);
					e=(l+v)*o;
					h=a+y;
					this.battleAttackerTrait(3);
					this.battleDefenderTrait(4)
				}
				else
					{
					var l=this.battleAttackerMoundIndex.isPlayer?this.battleDefender.traits[3].value:this.battleDefender.traits[3].value*(1+this.armyUpgrades().biteBonus()/100),a=this.battleAttackerMoundIndex.isPlayer?this.battleAttacker.traits[4].value*(1+this.armyUpgrades().stingBonus()/100):this.battleAttacker.traits[4].value,v=this.battleAttackerMoundIndex.isPlayer?this.battleDefender.strengthBonus:this.battleDefender.strengthBonus*(1+this.armyUpgrades().strengthBonus()/100),y=this.battleAttackerMoundIndex.isPlayer?this.battleAttacker.agilityBonus*(1+this.armyUpgrades().agilityBonus()/100):this.battleAttacker.agilityBonus;
					h=l+v;
					e=(a+y)*o;
					this.battleAttackerTrait(4);
					this.battleDefenderTrait(3)
				}
				r=e*e/h;
				p=RandomInRange(r-r/10,r+r/10);
				this.battleDamage(p);
				this.battleDamage()<=this.battleDefender.health/20&&this.battleDamage(this.battleDefender.health/20);
				this.battleDamage()>=this.battleDefender.currentHealth()&&(this.battleAttacker.experience(this.battleAttacker.experience()+this.battleDefender.experience()),this.battleDamage(this.battleDefender.currentHealth()));
				this.battleTurnClock=this.battleTurnLength()
			}
			else
				{
				if(this.battleAttackerMoundIndex.isPlayer)
					{
					if(this.map().battleReport.won(!0),c=this.map().Clear(),this.map().tilesCleared()==this.map().tileCount()&&(this.nation().mapComplete(!0),this.achievementCounts[21].Update(this.achievementCounts[21].value+1)),c!=null)
						{
						switch(c)
							{
							case 0:this.nation().isDefeated(!0);
							this.treasureTitle("YOU HAVE DESTROYED THE ENEMY");
							this.treasureText("YOU HAVE WON THE WAR.  IS THERE MORE?");
							break;
							case 1:this.nation().mineFound()==!1&&(this.bonusMinePercent(this.bonusMinePercent()+2),this.nation().mineFound(!0),this.treasureTitle("CAPTURED AN ENEMY MINE"),this.treasureText("YOUR CRITTERS CAN NOW MINE 2% FASTER"),this.achievementCounts[10].Update(this.achievementCounts[10].value+1));
							break;
							case 2:this.nation().farmFound()==!1&&(this.bonusFarmPercent(this.bonusFarmPercent()+2),this.nation().farmFound(!0),this.treasureTitle("CAPTURED AN ENEMY FARM"),this.treasureText("YOUR CRITTERS CAN NOW FARM 2% FASTER"),this.achievementCounts[18].Update(this.achievementCounts[18].value+1));
							break;
							case 3:this.nation().carryFound()==!1&&(this.bonusCarrierPercent(this.bonusCarrierPercent()+2),this.nation().carryFound(!0),this.treasureTitle("CAPTURED ENEMY EQUIPMENT"),this.treasureText("YOUR CRITTERS CAN CARRY 2% MORE"),this.achievementCounts[19].Update(this.achievementCounts[19].value+1));
							break;
							case 4:this.nation().factoryFound()==!1&&(this.bonusFactoryPercent(this.bonusFactoryPercent()+2),this.nation().factoryFound(!0),this.treasureTitle("CAPTURED AN ENEMY FACTORY"),this.treasureText("YOUR CRITTERS CAN NOW PRODUCE SOD 2% FASTER"),this.achievementCounts[20].Update(this.achievementCounts[20].value+1));
							break;
							case 8:this.nation().exploreFound()==!1&&(this.nation().exploreFound(!0),this.treasureTitle("FOUND HIGH GROUND"),this.treasureText("YOUR EXPLORATION SPEED INCREASED 50% ON THIS MAP"),this.achievementCounts[12].Update(this.achievementCounts[12].value+1));
							break;
							case 9:this.nation().fortFound()==!1&&(this.nation().fortFound(!0),this.treasureTitle("FOUND AN ABANDONED FORT"),this.treasureText("YOUR TRACKING SPEED INCREASED 50% ON THIS MAP"),this.achievementCounts[22].Update(this.achievementCounts[22].value+1));
							break;
							case 7:this.nation().boostFound()==!1&&(this.maxBoosts(this.maxBoosts()+5),this.boosts(this.maxBoosts()),this.nation().boostFound(!0),this.treasureTitle("LOVE CONQUERS ALL"),this.treasureText("YOUR MAXIMUM BOOSTS HAVE INCREASED BY 5."),this.achievementCounts[14].Update(this.achievementCounts[14].value+1));
							break;
							case 6:for(i=enemyGenes[this.nation().enemy],t=0;
							t<i.length;
							t++)u=new Gene(i[t].id,i[t].trait,i[t].expression,i[t].name,i[t].value,i[t].good),u.mutation=!0,b=jQuery.grep(this.mother().traits[i[t].trait].genes,function(n)
								{
								return n.id==i[t].id
							}
							),this.mother().traits[u.trait].genes.push(u),this.mother().traits[u.trait].mutation=!0;
							s=this.DefaultCritter(this.mother().gender,this.mother().job,this.mother().generation);
							s.Load(this.mother());
							s.isLocked(!1);
							this.mother(s);
							this.nation().geneFound(!0);
							this.treasureTitle("YOUR CAPTURED AN ENEMY");
							this.treasureText("YOUR QUEEN HAS ASSIMILATED A MUTATION");
							this.achievementCounts[11].Update(this.achievementCounts[11].value+1);
							break;
							case 5:this.nation().treasuresFound(this.nation().treasuresFound()+1);
							this.treasureTitle("YOU FOUND AN ARTIFACT");
							w=RandomInRange(1,4);
							switch(w)
								{
								case 1:this.treasureText("IT IS INCREASING YOUR TROOPS STRENGTH");
								this.armyUpgrades().strengthBonus(this.armyUpgrades().strengthBonus()+5);
								break;
								case 2:this.treasureText("IT IS INCREASING YOUR TROOPS AGILITY");
								this.armyUpgrades().agilityBonus(this.armyUpgrades().agilityBonus()+5);
								break;
								case 3:this.treasureText("IT IS INCREASING YOUR TROOPS BITE");
								this.armyUpgrades().biteBonus(this.armyUpgrades().biteBonus()+5);
								break;
								case 4:this.treasureText("IT IS INCREASING YOUR TROOPS STING");
								this.armyUpgrades().stingBonus(this.armyUpgrades().stingBonus()+5)
							}
						}
						this.showTreasure(!0);
						this.UpdateProduction();
						this.Save()
					}
					this.achievementCounts[8].Update(this.achievementCounts[8].value+1)
				}
				else this.map().battleReport.won(!1);
				this.armyMound.remove(function(n)
					{
					return n.currentHealth()<=0
				}
				);
				this.map().currentBattle=null;
				this.battleDefender=null;
				this.battleDefenderId(0);
				this.battleAttackerId(0);
				this.battleOrderIndex(0);
				this.battleOrder.removeAll();
				this.inBattle(!1);
				this.UpdateArmyUpgrades()
			}
		}
		else this.battleTurnClock--,this.battleDefender!=null&&(this.battleDefender.currentHealth(this.battleDefender.currentHealth()-this.battleDamage()/this.battleTurnLength()),this.battleDefender.currentHealth()<1&&this.battleDefender.currentHealth(0));
		else for(n=0;
		n<this.armyMound().length;
		n++)this.armyMound()[n].currentHealth()<this.armyMound()[n].health&&(this.armyMound()[n].currentHealth(this.armyMound()[n].currentHealth()+this.armyMound()[n].health/this.armyMound()[n].actionTime*(1+this.armyUpgrades().medicBonus()/100)),this.armyMound()[n].currentHealth()>this.armyMound()[n].health&&this.armyMound()[n].currentHealth(this.armyMound()[n].health))
	}
	,n.prototype.UpdateArmyUpgrades=function()
		{
		var t,n;
		for(this.armyUpgrades().generalBonus(0),this.armyUpgrades().scoutBonus(0),this.armyUpgrades().medicBonus(0),this.armyUpgrades().hasGeneral(!1),this.armyUpgrades().hasScout(!1),this.armyUpgrades().hasMedic(!1),t=0,n=0;
		n<this.armyMound().length;
		n++)switch(t)
			{
			case 0:this.armyMound()[n].rank("General");
			this.armyUpgrades().hasGeneral(!0);
			this.armyUpgrades().generalBonus(this.armyMound()[n].level()*10);
			t++;
			break;
			case 1:this.armyMound()[n].rank("Scout");
			this.armyUpgrades().hasScout(!0);
			this.armyUpgrades().scoutBonus(this.armyMound()[n].level()*10);
			t++;
			break;
			case 2:this.armyMound()[n].rank("Medic");
			this.armyUpgrades().hasMedic(!0);
			this.armyUpgrades().medicBonus(this.armyMound()[n].level()*10);
			t++;
			break;
			default:this.armyMound()[n].rank(this.armyMound()[n].level()<8?"Soldier":this.armyMound()[n].level()<15?"Veteran":"Elite")
		}
	}
	,n.prototype.AutoBattle=function()
		{
		var n,t;
		this.atWar()&&!this.pauseAutoBattle()&&(this.autoBattleClock()<=0?(this.autoBattleClock(this.autoBattleTime),this.map().SetRandomBattle()&&this.StartBattle()):!this.inBattle()&&this.map().tilesCleared()<this.map().tileCount()&&this.armyUpgrades().hasGeneral()?(n=this.nation().fortFound()?50:0,n+=this.nation().isDefeated()?100:0,n+=this.armyUpgrades().generalBonus(),t=1*(1+n/100),this.autoBattleClock(this.autoBattleClock()-t),this.autoBattleClock()<0&&this.autoBattleClock(0)):this.armyUpgrades().hasGeneral()||this.autoBattleClock(this.autoBattleTime))
	}
	,n.prototype.Explore=function()
		{
		var n,t;
		this.atWar()&&!this.pauseExplore()&&(this.exploreClock()<=0?(this.exploreClock(this.exploreTime),this.map().Explore(null)):!this.inBattle()&&this.map().canExplore()&&this.armyUpgrades().hasScout()?(n=this.nation().exploreFound()?50:0,n+=this.nation().isDefeated()?100:0,n+=this.armyUpgrades().scoutBonus(),t=1*(1+n/100),this.exploreClock(this.exploreClock()-t),this.exploreClock()<0&&this.exploreClock(0)):this.armyUpgrades().hasScout()||this.exploreClock(this.exploreTime))
	}
	,n.prototype.AcknowledgeTreasure=function()
		{
		this.showTreasure(!1)
	}
	,n.prototype.Reset=function()
		{
		localStorage.clear();
		location.reload()
	}
	,n.prototype.CheckAchievements=function()
		{
		if(this.achievementCheck<=0)
			{
			for(var n=0;
			n<this.achievements().length;
			n++)this.achievementCounts[this.achievements()[n].type].value>=this.achievements()[n].value&&!this.achievements()[n].isUnlocked()&&(this.achievements()[n].isUnlocked(!0),this.achievementsUnlocked(this.achievementsUnlocked()+1),$(".tabcontents").notify("Achievement Unlocked. "+this.achievements()[n].name,"info"));
			this.achievementCheck=5*ticksPerSecond
		}
		else this.achievementCheck--
	}
	,n.prototype.AnimateWorkers=function()
		{
		for(var n=0;
		n<this.mineMound().length;
		n++)this.mineMound()[n].currentHealth(this.mineMound()[n].currentHealth()+this.mineMound()[n].health/this.mineMound()[n].actionTime),this.mineMound()[n].currentHealth()>=this.mineMound()[n].health&&this.mineMound()[n].currentHealth(0);
		for(n=0;
		n<this.farmMound().length;
		n++)this.farmMound()[n].currentHealth(this.farmMound()[n].currentHealth()+this.farmMound()[n].health/this.farmMound()[n].actionTime),this.farmMound()[n].currentHealth()>=this.farmMound()[n].health&&this.farmMound()[n].currentHealth(0);
		for(n=0;
		n<this.carrierMound().length;
		n++)this.carrierMound()[n].currentHealth(this.carrierMound()[n].currentHealth()+this.carrierMound()[n].health/this.carrierMound()[n].actionTime),this.carrierMound()[n].currentHealth()>=this.carrierMound()[n].health&&this.carrierMound()[n].currentHealth(0);
		for(n=0;
		n<this.factoryMound().length;
		n++)this.factoryMound()[n].currentHealth(this.factoryMound()[n].currentHealth()+this.factoryMound()[n].health/this.factoryMound()[n].actionTime),this.factoryMound()[n].currentHealth()>=this.factoryMound()[n].health&&this.factoryMound()[n].currentHealth(0)
	}
	,n.prototype.CheckSave=function()
		{
		this.saveCheck<=0?(this.sodPerSecondRaw()>=100&&this.isHeirsUnlocked(!0),this.Save(),this.saveCheck=60*ticksPerSecond):this.saveCheck--
	}
	,n.prototype.Sort=function()
		{
		for(var t=this.maleMound().length,n;
		this.maleMound().length>this.maxMaleMoundSize();
		)
			{
			if(t--,!this.maleMound()[t].isLocked())
				{
				this.maleMound.splice(t,1);
				continue
			}
			t==0&&this.maleMound.pop()
		}
		for(n=this.femaleMound().length;
		this.femaleMound().length>this.maxFemaleMoundSize();
		)
			{
			if(n--,!this.femaleMound()[n].isLocked())
				{
				this.femaleMound.splice(n,1);
				continue
			}
			n==0&&this.femaleMound.pop()
		}
		for(t=this.princeMound().length;
		this.princeMound().length>this.maxPrinceMoundSize();
		)
			{
			if(t--,!this.princeMound()[t].isLocked())
				{
				this.princeMound.splice(t,1);
				continue
			}
			t==0&&this.princeMound.pop()
		}
		for(n=this.princessMound().length;
		this.princessMound().length>this.maxPrincessMoundSize();
		)
			{
			if(n--,!this.princessMound()[n].isLocked())
				{
				this.princessMound.splice(n,1);
				continue
			}
			n==0&&this.princessMound.pop()
		}
		for(this.SortMound(this.maleMound,this.maleSort()),this.SortMound(this.femaleMound,this.femaleSort()),this.SortMound(this.princeMound,this.princeSort()),this.SortMound(this.princessMound,this.princessSort()),this.SortMound(this.carrierMound,"carry"),this.SortMound(this.mineMound,"mine"),this.SortMound(this.farmMound,"farm"),this.SortMound(this.factoryMound,"factory"),this.SortMound(this.armyMound,this.armySort());
		this.carrierMound().length>this.maxCarrierMoundSize();
		)this.carrierMound.pop();
		while(this.mineMound().length>this.maxMineMoundSize())this.mineMound.pop();
		while(this.farmMound().length>this.maxFarmMoundSize())this.farmMound.pop();
		while(this.factoryMound().length>this.maxFactoryMoundSize())this.factoryMound.pop();
		while(this.armyMound().length>this.maxArmyMoundSize())this.armyMound.pop();
		this.UpdateArmyUpgrades()
	}
	,n.prototype.SortMound=function(n,t)
		{
		n.sort(function(n,t)
			{
			return t.score-n.score
		}
		);
		switch(t)
			{
			case"mutations":n.sort(function(n,t)
				{
				return t.totalMutations-n.totalMutations
			}
			);
			break;
			case"mine":n.sort(function(n,t)
				{
				return t.dirtPerSecond-n.dirtPerSecond
			}
			);
			break;
			case"carry":n.sort(function(n,t)
				{
				return t.carryPerSecond-n.carryPerSecond
			}
			);
			break;
			case"farm":n.sort(function(n,t)
				{
				return t.grassPerSecond-n.grassPerSecond
			}
			);
			break;
			case"factory":n.sort(function(n,t)
				{
				return t.sodPerSecond-n.sodPerSecond
			}
			);
			break;
			case"vitality":n.sort(function(n,t)
				{
				return t.traits[0].value-n.traits[0].value
			}
			);
			break;
			case"strength":n.sort(function(n,t)
				{
				return t.traits[1].value-n.traits[1].value
			}
			);
			break;
			case"agility":n.sort(function(n,t)
				{
				return t.traits[2].value-n.traits[2].value
			}
			);
			break;
			case"bite":n.sort(function(n,t)
				{
				return t.traits[3].value-n.traits[3].value
			}
			);
			break;
			case"sting":n.sort(function(n,t)
				{
				return t.traits[4].value-n.traits[4].value
			}
			);
			break;
			case"level":n.sort(function(n,t)
				{
				return t.level()-n.level()
			}
			);
			break;
			case"base":n.sort(function(n,t)
				{
				return t.baseScore-n.baseScore
			}
			);
			break;
			case"bonus":n.sort(function(n,t)
				{
				return t.bonusScore-n.bonusScore
			}
			)
		}
	}
	,n.prototype.CalculateExpression=function(n,t)
		{
		return n==0&&t==0?0:n==2&&t==2?2:n==1&&t==1?CoinFlip()?1:CoinFlip()?2:0:n==2&&t==1||n==1&&t==2?CoinFlip()?1:2:n==0&&t==1||n==1&&t==0?CoinFlip()?1:0:n==0&&t==2||n==2&&t==0?1:void 0
	}
	,n.prototype.MutateStat=function(n,t,i,r)
		{
		var f=n<t?n-StatVariance(n):t-StatVariance(t),e=n>t?n+StatVariance(n):t+StatVariance(t),u=RandomInRange(f,e);
		return u<i&&(u=i),u>r&&(u=r),u
	}
	,n.prototype.DefaultCritter=function(n,t,i)
		{
		this.achievementCounts[6].Update(this.achievementCounts[6].value+1);
		var r=new Critter(i,this.achievementCounts[6].value,n);
		return r.job=t,r
	}
	,n.prototype.Save=function()
		{
		var n=new GameSave,t;
		return n.version="1.0",n.dirtRaw=this.dirtRaw(),n.grassRaw=this.grassRaw(),n.sodRaw=this.sodRaw(),n.factoryDirtRaw=this.factoryDirtRaw(),n.factoryGrassRaw=this.factoryGrassRaw(),n.generations=this.generations(),n.mother=this.mother(),n.father=this.father(),n.princess=this.princess(),n.prince=this.prince(),n.sodDedicatedToBreeding=this.sodDedicatedToBreeding(),n.isHeirsUnlocked=this.isHeirsUnlocked(),n.femaleMound=this.femaleMound(),n.maleMound=this.maleMound(),n.princessMound=this.princessMound(),n.princeMound=this.princeMound(),n.mineMound=this.mineMound(),n.farmMound=this.farmMound(),n.carrierMound=this.carrierMound(),n.factoryMound=this.factoryMound(),n.armyMound=this.armyMound(),n.maxFemaleMoundSize=this.maxFemaleMoundSize(),n.maxMaleMoundSize=this.maxMaleMoundSize(),n.maxPrincessMoundSize=this.maxPrincessMoundSize(),n.maxPrinceMoundSize=this.maxPrinceMoundSize(),n.maxMineMoundSize=this.maxMineMoundSize(),n.bonusMinePercent=this.bonusMinePercent(),n.bonusFarmPercent=this.bonusFarmPercent(),n.bonusCarrierPercent=this.bonusCarrierPercent(),n.bonusFactoryPercent=this.bonusFactoryPercent(),n.maxFarmMoundSize=this.maxFarmMoundSize(),n.maxCarrierMoundSize=this.maxCarrierMoundSize(),n.maxFactoryMoundSize=this.maxFactoryMoundSize(),n.maxArmyMoundSize=this.maxArmyMoundSize(),n.femaleSort=this.femaleSort(),n.maleSort=this.maleSort(),n.princessSort=this.princessSort(),n.princeSort=this.princeSort(),n.armySort=this.armySort(),n.map=this.map(),n.tiles=this.map().tiles(),n.atWar=this.atWar(),n.nations=this.nations(),n.nation=this.nation(),n.achievements=this.achievements(),n.achievementCounts=this.achievementCounts,n.achievementsUnlocked=this.achievementsUnlocked(),n.battleTurnLength=this.battleTurnLength(),n.boosts=this.boosts(),n.maxBoosts=this.maxBoosts(),n.armyUpgrades=this.armyUpgrades(),t=$.base64.encode(ko.toJSON(n)),localStorage.setItem("game2",t),$(".tabcontents").notify("Game Saved","info"),this.saveCheck=60*ticksPerSecond,t
	}
	,n.prototype.Load=function(n)
		{
		var t,u,s,f,e,o,h,i,r;
		try
			{
			if(n!==null||localStorage.getItem("game2")!==null)
				{
				if(t=n!=null?JSON.parse($.base64.decode(n)):JSON.parse($.base64.decode(localStorage.getItem("game2"))),this.dirtRaw(t.dirtRaw),this.grassRaw(t.grassRaw),this.sodRaw(t.sodRaw),this.factoryDirtRaw(t.factoryDirtRaw),this.factoryGrassRaw(t.factoryGrassRaw),this.generations(t.generations),this.sodDedicatedToBreeding(t.sodDedicatedToBreeding),this.isHeirsUnlocked(t.isHeirsUnlocked),this.maxFemaleMoundSize(t.maxFemaleMoundSize),this.maxMaleMoundSize(t.maxMaleMoundSize),this.maxPrincessMoundSize(t.maxPrincessMoundSize),this.maxPrinceMoundSize(t.maxPrinceMoundSize),this.maxMineMoundSize(t.maxMineMoundSize),this.maxFarmMoundSize(t.maxFarmMoundSize),this.maxCarrierMoundSize(t.maxCarrierMoundSize),this.maxFactoryMoundSize(t.maxFactoryMoundSize),this.maxArmyMoundSize(t.maxArmyMoundSize),this.bonusMinePercent(t.bonusMinePercent),this.bonusCarrierPercent(t.bonusCarrierPercent),this.bonusFarmPercent(t.bonusFarmPercent),this.bonusFactoryPercent(t.bonusFactoryPercent),this.femaleSort(t.femaleSort),this.maleSort(t.maleSort),this.princeSort(t.princeSort),this.princessSort(t.princessSort),this.armySort(t.armySort),this.atWar(t.atWar),this.achievementsUnlocked(t.achievementsUnlocked),this.battleTurnLength(t.battleTurnLength!=undefined?t.battleTurnLength:ticksPerSecond/2),t.boosts!=undefined&&(this.boosts(t.boosts),this.maxBoosts(t.maxBoosts)),t.nations!=undefined)for(this.nations=ko.observableArray(),i=0;
				i<t.nations.length;
				i++)u=new Nation(t.nations[i].enemy,t.nations[i].custom,t.nations[i].name,t.nations[i].desc,t.nations[i].lowBaseValue,t.nations[i].highBaseValue,t.nations[i].armySizeBase,t.nations[i].requiredToUnlock,t.nations[i].treasurePoints),u.mineFound(t.nations[i].mineFound),u.farmFound(t.nations[i].farmFound),u.carryFound(t.nations[i].carryFound),u.factoryFound(t.nations[i].factoryFound),u.exploreFound(t.nations[i].exploreFound),u.fortFound(t.nations[i].fortFound!=undefined?t.nations[i].fortFound:!1),u.geneFound(t.nations[i].geneFound),u.boostFound(t.nations[i].boostFound),u.treasuresFound(t.nations[i].treasuresFound),u.mapComplete(t.nations[i].mapComplete),u.isDefeated(t.nations[i].isDefeated),u.isUnlocked(t.nations[i].isUnlocked),this.nations.push(u);
				if(t.map!=undefined)for(this.map(new GameMap),this.map().mound=t.map.mound,this.map().enemy=t.map.enemy,this.map().mine=t.map.mine,this.map().farm=t.map.farm,this.map().carry=t.map.carry,this.map().factory=t.map.factory,this.map().explore=t.map.explore,this.map().boost=t.map.boost,this.map().gene=t.map.gene,this.map().fort=t.map.fort,this.map().treasures=t.map.treasures,this.map().tileCount(t.map.tileCount),this.map().tilesCleared(t.map.tilesCleared),this.map().canExplore(t.map.canExplore),this.map().highestDanger=t.map.highestDanger!=undefined?t.map.highestDanger:1,i=0;
				i<t.tiles.length;
				i++)
					{
					for(s=ko.observableArray(),f=0;
					f<t.tiles[i].length;
					f++)e=new GameMapTile(new Point(f,i)),e.isCleared(t.tiles[i][f].isCleared),e.isUnlocked(t.tiles[i][f].isUnlocked),e.extraClass(t.tiles[i][f].extraClass),e.danger(t.tiles[i][f].danger),s.push(e);
					this.map().tiles.push(s)
				}
				if(t.nation!=undefined&&(o=jQuery.grep(this.nations(),function(n)
					{
					return n.enemy==t.nation.enemy
				}
				),o.length>0&&(this.nation(o[0]),this.map().nation=o[0])),t.achievements!=undefined)for(i=0;
				i<t.achievements.length;
				i++)this.achievements()[i].isUnlocked(t.achievements[i].isUnlocked);
				if(t.achievementCounts!=undefined)
					{
					for(this.achievementCounts=[],i=0;
					i<t.achievementCounts.length;
					i++)h=new AchievementCount(t.achievementCounts[i].type),h.value=t.achievementCounts[i].value,this.achievementCounts.push(h);
					while(this.achievementCounts.length<23)this.achievementCounts.push(new AchievementCount(i))
				}
				for(r=new Critter(t.mother.generation,t.mother.id,t.mother.gender),r.Load(t.mother),this.mother(r),r=new Critter(t.father.generation,t.father.id,t.father.gender),r.Load(t.father),this.father(r),r=new Critter(t.princess.generation,t.princess.id,t.princess.gender),r.Load(t.princess),this.princess(r),r=new Critter(t.prince.generation,t.prince.id,t.prince.gender),r.Load(t.prince),this.prince(r),this.femaleMound.removeAll(),i=0;
				i<t.femaleMound.length;
				i++)r=new Critter(t.femaleMound[i].generation,t.femaleMound[i].id,t.femaleMound[i].gender),r.Load(t.femaleMound[i]),this.femaleMound.push(r);
				for(this.maleMound.removeAll(),i=0;
				i<t.maleMound.length;
				i++)r=new Critter(t.maleMound[i].generation,t.maleMound[i].id,t.maleMound[i].gender),r.Load(t.maleMound[i]),this.maleMound.push(r);
				for(this.princessMound.removeAll(),i=0;
				i<t.princessMound.length;
				i++)r=new Critter(t.princessMound[i].generation,t.princessMound[i].id,t.princessMound[i].gender),r.Load(t.princessMound[i]),this.princessMound.push(r);
				for(this.princeMound.removeAll(),i=0;
				i<t.princeMound.length;
				i++)r=new Critter(t.princeMound[i].generation,t.princeMound[i].id,t.princeMound[i].gender),r.Load(t.princeMound[i]),this.princeMound.push(r);
				for(this.mineMound.removeAll(),i=0;
				i<t.mineMound.length;
				i++)r=new Critter(t.mineMound[i].generation,t.mineMound[i].id,t.mineMound[i].gender),r.Load(t.mineMound[i]),this.mineMound.push(r);
				for(this.farmMound.removeAll(),i=0;
				i<t.farmMound.length;
				i++)r=new Critter(t.farmMound[i].generation,t.farmMound[i].id,t.farmMound[i].gender),r.Load(t.farmMound[i]),this.farmMound.push(r);
				for(this.carrierMound.removeAll(),i=0;
				i<t.carrierMound.length;
				i++)r=new Critter(t.carrierMound[i].generation,t.carrierMound[i].id,t.carrierMound[i].gender),r.Load(t.carrierMound[i]),this.carrierMound.push(r);
				for(this.factoryMound.removeAll(),i=0;
				i<t.factoryMound.length;
				i++)r=new Critter(t.factoryMound[i].generation,t.factoryMound[i].id,t.factoryMound[i].gender),r.Load(t.factoryMound[i]),this.factoryMound.push(r);
				for(this.armyMound.removeAll(),i=0;
				i<t.armyMound.length;
				i++)r=new Critter(t.armyMound[i].generation,t.armyMound[i].id,t.armyMound[i].gender),r.Load(t.armyMound[i]),this.armyMound.push(r);
				this.armyUpgrades(new ArmyUpgrades);
				this.armyUpgrades().strengthBonus(t.armyUpgrades.strengthBonus);
				this.armyUpgrades().agilityBonus(t.armyUpgrades.agilityBonus);
				this.armyUpgrades().biteBonus(t.armyUpgrades.biteBonus);
				this.armyUpgrades().stingBonus(t.armyUpgrades.stingBonus);
				this.armyUpgrades().generalBonus(t.armyUpgrades.generalBonus);
				this.armyUpgrades().scoutBonus(t.armyUpgrades.scoutBonus);
				this.armyUpgrades().medicBonus(t.armyUpgrades.medicBonus);
				this.armyUpgrades().hasGeneral(t.armyUpgrades.hasGeneral);
				this.armyUpgrades().hasScout(t.armyUpgrades.hasScout);
				this.armyUpgrades().hasMedic(t.armyUpgrades.hasMedic);
				this.UpdateProduction()
			}
		}
		catch(c)
			{
			n==null&&this.Reset()
		}
		n!=null&&this.Save()
	}
	,n
}
(),Critter=function()
	{
	function n(n,t,i)
		{
		this.id=-1;
		this.score=0;
		this.baseScore=0;
		this.bonusScore=0;
		this.generation=1;
		this.gender=1;
		this.job=1;
		this.traits=[];
		this.totalMutations=0;
		this.currentHealth=ko.observable(0);
		this.healthPercentage=ko.computed(function()
			{
			var n=Math.round(this.currentHealth()/this.health*1e4)/100;
			return n>100&&(n=100),n<0&&(n=0),n+"%"
		}
		,this);
		this.isSelected=ko.observable(!1);
		this.isLocked=ko.observable(!1);
		this.experience=ko.observable(0);
		this.level=ko.computed(function()
			{
			return LevelFromXp(this.experience())
		}
		,this);
		this.rank=ko.observable("Recruit");
		this.generation=n;
		this.id=t;
		this.gender=i;
		this.traits.push(new Trait(0,"vitality",5));
		this.traits.push(new Trait(1,"strength",5));
		this.traits.push(new Trait(2,"agility",5));
		this.traits.push(new Trait(3,"bite",5));
		this.traits.push(new Trait(4,"sting",5))
	}
	return n.prototype.Load=function(n)
		{
		this.isSelected=ko.observable(!1);
		this.experience=ko.observable(n.experience);
		this.isLocked=ko.observable(n.isLocked);
		this.currentHealth=ko.observable(n.currentHealth);
		this.healthPercentage=ko.computed(function()
			{
			return Math.round(this.currentHealth()/this.health*1e4)/100+"%"
		}
		,this);
		this.level=ko.computed(function()
			{
			return LevelFromXp(this.experience())
		}
		,this);
		this.rank=ko.observable(n.rank);
		this.job=n.job;
		this.traits=n.traits;
		this.CalculateScore()
	}
	,n.prototype.CalculateScore=function()
		{
		var r=1,u=1,f=1,n,t,i,e,o;
		for(this.totalMutations=0,n=0;
		n<this.traits.length;
		n++)
			{
			for(t=0,i=0;
			i<this.traits[n].genes.length;
			i++)this.traits[n].genes[i].expression==2&&(this.traits[n].genes[i].good?t+=this.traits[n].genes[i].value:t-=this.traits[n].genes[i].value),this.totalMutations++;
			t=Math.round(t);
			e=this.traits[n].base+this.traits[n].base*(t/100);
			this.traits[n].value=SmartRound(e);
			this.traits[n].trueValue=SmartRound(e);
			this.traits[n].bonus=t;
			f=f*this.traits[n].base;
			u=u*t;
			r=r*this.traits[n].value
		}
		this.score=SmartRound(Math.pow(r,.2));
		this.baseScore=SmartRound(Math.pow(f,.2));
		this.bonusScore=SmartRound(Math.pow(u,.2));
		this.traits[2].stats=[];
		this.actionTime=30*Math.pow(.9,Math.log(this.traits[2].value)/Math.LN2)*ticksPerSecond;
		this.actionTime<ticksPerSecond*3&&(this.actionTime=ticksPerSecond*3);
		o=this.actionTime/ticksPerSecond;
		this.actionTimeSeconds=Math.round(o*100)/100;
		this.traits[2].stats.push(new NameValue("Speed",this.actionTimeSeconds+" seconds"));
		this.traits[1].stats=[];
		this.carryPerSecond=SmartRound(60/(this.actionTime/ticksPerSecond)*this.traits[1].value/60);
		this.traits[1].stats.push(new NameValue("Carrying Capacity",this.carryPerSecond+" per sec."));
		this.traits[0].stats=[];
		this.health=SmartRound(this.traits[0].value*15);
		this.currentHealth(this.job==4?this.health:0);
		this.traits[0].stats.push(new NameValue("Health",this.health.toString()));
		this.sodPerSecond=SmartRound(60/(this.actionTime/ticksPerSecond)*this.traits[0].value/60);
		this.traits[0].stats.push(new NameValue("Sod Production",this.sodPerSecond+" per sec."));
		this.traits[3].stats=[];
		this.strengthBonus=SmartRound(this.traits[1].value/2);
		this.traits[3].stats.push(new NameValue("Strength Bonus",this.strengthBonus.toString()));
		this.grassPerSecond=SmartRound(60/(this.actionTime/ticksPerSecond)*this.traits[3].value/60);
		this.traits[3].stats.push(new NameValue("Farm Production",this.grassPerSecond+" per sec."));
		this.traits[3].trueValue=SmartRound(this.traits[3].value+this.strengthBonus);
		this.traits[4].stats=[];
		this.agilityBonus=SmartRound(this.traits[2].value/2);
		this.traits[4].stats.push(new NameValue("Agility Bonus",this.agilityBonus.toString()));
		this.dirtPerSecond=SmartRound(60/(this.actionTime/ticksPerSecond)*this.traits[4].value/60);
		this.traits[4].stats.push(new NameValue("Mine Production",this.dirtPerSecond+" per sec."));
		this.traits[4].trueValue=SmartRound(this.traits[4].value+this.agilityBonus)
	}
	,n
}
(),Trait=function()
	{
	function n(n,t,i)
		{
		this.base=0;
		this.value=0;
		this.trueValue=0;
		this.bonus=0;
		this.genes=[];
		this.mutation=!1;
		this.stats=[];
		this.type=n;
		this.name=t;
		this.base=i;
		this.value=i;
		this.trueValue=i
	}
	return n
}
(),Gene=function()
	{
	function n(n,t,i,r,u,f)
		{
		this.mutation=!1;
		this.id=n;
		this.trait=t;
		this.expression=i;
		this.name=r;
		this.value=u;
		this.good=f
	}
	return n
}
(),GameSave=function()
	{
	function n()
		{
		this.tiles=[];
		this.nations=[]
	}
	return n
}
(),NameValue=function()
	{
	function n(n,t)
		{
		this.name=n;
		this.value=t
	}
	return n
}
(),AchievementType,GenderType,ExpressionType,JobType,EnemyCustomType,EnemyType;
(function(n)
	{
	n[n.Vitality=0]="Vitality";
	n[n.Strength=1]="Strength";
	n[n.Agility=2]="Agility";
	n[n.Bite=3]="Bite";
	n[n.Sting=4]="Sting";
	n[n.Score=5]="Score";
	n[n.CrittersBorn=6]="CrittersBorn";
	n[n.Generations=7]="Generations";
	n[n.BattlesWon=8]="BattlesWon";
	n[n.DirtPerSecond=9]="DirtPerSecond";
	n[n.MinesFound=10]="MinesFound";
	n[n.GenesFound=11]="GenesFound";
	n[n.ExploresFound=12]="ExploresFound";
	n[n.Mutations=13]="Mutations";
	n[n.BoostsFound=14]="BoostsFound";
	n[n.GrassPerSecond=15]="GrassPerSecond";
	n[n.SodPerSecond=16]="SodPerSecond";
	n[n.CarryPerSecond=17]="CarryPerSecond";
	n[n.FarmsFound=18]="FarmsFound";
	n[n.CarriersFound=19]="CarriersFound";
	n[n.FactoriesFound=20]="FactoriesFound";
	n[n.CompletedMaps=21]="CompletedMaps";
	n[n.FortsFound=22]="FortsFound"
}
)(AchievementType||(AchievementType=
	{
}
));
var AchievementCount=function()
	{
	function n(n)
		{
		this.value=0;
		this.type=n;
		this.value=0
	}
	return n.prototype.Update=function(n)
		{
		n>this.value&&(this.value=n)
	}
	,n
}
(),Achievement=function()
	{
	function n(n,t,i,r)
		{
		this.isUnlocked=ko.observable(!1);
		this.type=n;
		this.name=t;
		this.value=r;
		this.desc=i
	}
	return n
}
(),BattleReport=function()
	{
	function n()
		{
		this.won=ko.observable();
		this.enemy=ko.observable()
	}
	return n
}
(),ArmyUpgrades=function()
	{
	function n()
		{
		this.strengthBonus=ko.observable(0);
		this.agilityBonus=ko.observable(0);
		this.biteBonus=ko.observable(0);
		this.stingBonus=ko.observable(0);
		this.medicBonus=ko.observable(0);
		this.generalBonus=ko.observable(0);
		this.scoutBonus=ko.observable(0);
		this.hasGeneral=ko.observable(!1);
		this.hasScout=ko.observable(!1);
		this.hasMedic=ko.observable(!1)
	}
	return n
}
(),Point=function()
	{
	function n(n,t)
		{
		this.x=0;
		this.y=0;
		this.x=n;
		this.y=t
	}
	return n
}
(),GameMapTile=function()
	{
	function n(n)
		{
		this.isCleared=ko.observable(!1);
		this.isUnlocked=ko.observable(!1);
		this.danger=ko.observable(0);
		this.extraClass=ko.observable("");
		this.coords=n
	}
	return n
}
(),GameMap=function()
	{
	function n()
		{
		this.tiles=ko.observableArray().extend(
			{
			rateLimit:100
		}
		);
		this.treasures=[];
		this.battleReport=new BattleReport;
		this.enemyArmyMound=ko.observableArray([]);
		this.treasureFound=0;
		this.tileCount=ko.observable(0);
		this.tilesCleared=ko.observable(0);
		this.completePercentage=ko.computed(function()
			{
			return Math.round(this.tilesCleared()/this.tileCount()*1e3)/10+"%"
		}
		,this);
		this.canExplore=ko.observable(!0);
		this.highestDanger=1
	}
	return n.prototype.GetTile=function(n)
		{
		var t=this.tiles()[n.y];
		return t==undefined?undefined:t()[n.x]
	}
	,n.prototype.Clear=function()
		{
		var n,i,t,r;
		if(this.currentBattle!=null&&(n=this.GetTile(this.currentBattle),n.isUnlocked()))
			{
			if(n.isCleared(!0),n.isUnlocked(!1),this.tilesCleared(this.tilesCleared()+1),n.danger()>this.highestDanger&&(this.highestDanger=n.danger()),i=n.coords,t=this.GetTile(new Point(i.x,i.y-1)),t!=undefined&&t.isUnlocked(!0),t=this.GetTile(new Point(i.x,i.y+1)),t!=undefined&&t.isUnlocked(!0),t=this.GetTile(new Point(i.x-1,i.y)),t!=undefined&&t.isUnlocked(!0),t=this.GetTile(new Point(i.x+1,i.y)),t!=undefined&&t.isUnlocked(!0),this.canExplore(!0),n.coords.x==this.mound.x&&n.coords.y==this.mound.y)return n.extraClass("mound"),n.danger(0),null;
			if(this.mine!=undefined&&n.coords.x==this.mine.x&&n.coords.y==this.mine.y)return n.extraClass("mine"),n.danger(0),1;
			if(this.farm!=undefined&&n.coords.x==this.farm.x&&n.coords.y==this.farm.y)return n.extraClass("farm"),n.danger(0),2;
			if(this.carry!=undefined&&n.coords.x==this.carry.x&&n.coords.y==this.carry.y)return n.extraClass("carry"),n.danger(0),3;
			if(this.factory!=undefined&&n.coords.x==this.factory.x&&n.coords.y==this.factory.y)return n.extraClass("factory"),n.danger(0),4;
			if(this.fort!=undefined&&n.coords.x==this.fort.x&&n.coords.y==this.fort.y)return n.extraClass("fort"),n.danger(0),9;
			if(this.explore!=undefined&&n.coords.x==this.explore.x&&n.coords.y==this.explore.y)return n.extraClass("explore"),n.danger(0),8;
			if(this.gene!=undefined&&n.coords.x==this.gene.x&&n.coords.y==this.gene.y)return n.extraClass("gene"),n.danger(0),6;
			if(this.boost!=undefined&&n.coords.x==this.boost.x&&n.coords.y==this.boost.y)return n.extraClass("boost"),n.danger(0),7;
			if(this.enemy!=undefined&&n.coords.x==this.enemy.x&&n.coords.y==this.enemy.y)return n.extraClass("enemy"),n.danger(0),0;
			for(r=0;
			r<this.treasures.length;
			r++)if(this.treasures[r]!=undefined&&n.coords.x==this.treasures[r].x&&n.coords.y==this.treasures[r].y)return n.extraClass("treasure"),n.danger(0),5
		}
	}
	,n.prototype.Distance=function(n,t)
		{
		var i=n.x-t.x,r=n.y-t.y;
		return Math.floor(Math.sqrt(i*i+r*r))
	}
	,n.prototype.LocationTaken=function(n,t,i)
		{
		for(var r=0;
		r<t.length;
		r++)if(n.x==t[r].x&&n.y==t[r].y||this.Distance(n,t[r])<i)return!0;
		return!1
	}
	,n.prototype.Danger=function(n)
		{
		var i=14,t=9,u=5,h,r;
		if(n.x==this.enemy.x&&n.y==this.enemy.y)return i+1;
		if(this.mine!=undefined&&n.x==this.mine.x&&n.y==this.mine.y||this.carry!=undefined&&n.x==this.carry.x&&n.y==this.carry.y||this.farm!=undefined&&n.x==this.farm.x&&n.y==this.farm.y||this.factory!=undefined&&n.x==this.factory.x&&n.y==this.factory.y)return t+1;
		var f=RandomInRange(u-1,u+2),e=this.Distance(n,this.mound),o=this.Distance(n,this.enemy),c=this.mine!=undefined?this.Distance(n,this.mine):999,l=this.farm!=undefined?this.Distance(n,this.farm):999,a=this.carry!=undefined?this.Distance(n,this.carry):999,v=this.factory!=undefined?this.Distance(n,this.factory):999,s=Math.min(c,l,a,v);
		return e>=i&&o>=i&&s>=t?f:(h=-(i-10-e),e<i-10)?h<1&&e<u+1?e:f:(t=t-s+1,r=i-o+1,o<i&&s<i)?r>t?r<u?f:RandomInRange(r-1,r):t<u?f:RandomInRange(t-1,t):o<i?r<u?f:RandomInRange(r-1,r):s<i?t<u?f:RandomInRange(t-1,t):f
	}
	,n.prototype.BaseStat=function(n)
		{
		var t=this.nation.lowBaseValue+(n-1)/14*(this.nation.highBaseValue-this.nation.lowBaseValue);
		return Math.floor(t)
	}
	,n.prototype.Explore=function(n)
		{
		var r,f,u,t,i;
		if(this.canExplore)
			{
			if(n==null)
				{
				for(r=[],i=0;
				i<this.tiles().length;
				i++)
					{
					for(f=0;
					f<this.tiles()[i]().length;
					f++)if(u=this.GetTile(new Point(f,i)),u.isUnlocked()&&!u.isCleared()&&u.danger()==0&&u.extraClass()==""&&r.push(u),r.length>=25)break;
					if(r.length>=25)break
				}
				if(r.length==0)
					{
					this.canExplore(!1);
					return
				}
				r.length==1&&this.canExplore(!1);
				t=Shuffle(r)[0]
			}
			else t=this.GetTile(n);
			if(t.danger(this.Danger(t.coords)),t.coords.x==this.mound.x&&t.coords.y==this.mound.y)
				{
				t.extraClass("mound");
				t.danger(0);
				return
			}
			if(this.mine!=undefined&&t.coords.x==this.mine.x&&t.coords.y==this.mine.y)
				{
				t.extraClass("mine");
				t.danger(0);
				return
			}
			if(this.farm!=undefined&&t.coords.x==this.farm.x&&t.coords.y==this.farm.y)
				{
				t.extraClass("farm");
				t.danger(0);
				return
			}
			if(this.carry!=undefined&&t.coords.x==this.carry.x&&t.coords.y==this.carry.y)
				{
				t.extraClass("carry");
				t.danger(0);
				return
			}
			if(this.factory!=undefined&&t.coords.x==this.factory.x&&t.coords.y==this.factory.y)
				{
				t.extraClass("factory");
				t.danger(0);
				return
			}
			if(this.fort!=undefined&&t.coords.x==this.fort.x&&t.coords.y==this.fort.y)
				{
				t.extraClass("fort");
				t.danger(0);
				return
			}
			if(this.explore!=undefined&&t.coords.x==this.explore.x&&t.coords.y==this.explore.y)
				{
				t.extraClass("explore");
				t.danger(0);
				return
			}
			if(this.gene!=undefined&&t.coords.x==this.gene.x&&t.coords.y==this.gene.y)
				{
				t.extraClass("gene");
				t.danger(0);
				return
			}
			if(this.boost!=undefined&&t.coords.x==this.boost.x&&t.coords.y==this.boost.y)
				{
				t.extraClass("boost");
				t.danger(0);
				return
			}
			if(this.enemy!=undefined&&t.coords.x==this.enemy.x&&t.coords.y==this.enemy.y)
				{
				t.extraClass("enemy");
				t.danger(0);
				return
			}
			for(i=0;
			i<this.treasures.length;
			i++)if(this.treasures[i]!=undefined&&t.coords.x==this.treasures[i].x&&t.coords.y==this.treasures[i].y)
				{
				t.extraClass("treasure");
				t.danger(0);
				return
			}
		}
	}
	,n.prototype.SetRandomBattle=function()
		{
		for(var f,n,e,t=[],i=[],r=[],u=0;
		u<this.tiles().length;
		u++)for(f=0;
		f<this.tiles()[u]().length;
		f++)n=this.GetTile(new Point(f,u)),n.isUnlocked()&&!n.isCleared()&&n.danger()<=this.highestDanger&&n.danger()>0&&t.push(n),n.isUnlocked()&&!n.isCleared()&&n.danger()==0&&n.extraClass()==""&&i.push(n),n.isUnlocked()&&!n.isCleared()&&n.danger()>this.highestDanger&&r.push(n);
		return i.length==0&&t.length==0&&r.length==0?!1:(t.length>0?e=Shuffle(t)[0]:i.length>0?e=Shuffle(i)[0]:r.length>0&&(e=Shuffle(r)[0]),this.currentBattle=e.coords,!0)
	}
	,n.prototype.CreateArmy=function()
		{
		var o,h,c,l,e;
		if(this.currentBattle!=null)
			{
			o=1;
			h=this.GetTile(this.currentBattle);
			h.danger()==0?(this.Explore(this.currentBattle),o=this.Danger(this.currentBattle),h.danger(o)):o=h.danger();
			var s=this.BaseStat(o),u=s,n=s,t=s,i=s,r=s,f=this.nation.armySizeBase+Math.floor(o/5);
			switch(this.nation.enemy)
				{
				case 0:this.battleReport.enemy("Swarm of Gnats");
				break;
				case 9:this.battleReport.enemy("Battalion of Beetles");
				break;
				case 4:this.battleReport.enemy("Bed of Scorpions");
				break;
				case 6:this.battleReport.enemy("Tarantula Warrior");
				break;
				case 3:this.battleReport.enemy("Nest of Wasps");
				break;
				case 12:this.battleReport.enemy("Plague of Ticks");
				break;
				case 17:this.battleReport.enemy("Cloud of Grasshoppers");
				break;
				case 2:this.battleReport.enemy("Swarm of Chiggers");
				break;
				case 1:this.battleReport.enemy("Quiver of Ladybugs");
				break;
				case 5:this.battleReport.enemy("Hive of Bees");
				break;
				case 11:this.battleReport.enemy("Nest of Termites");
				break;
				case 10:this.battleReport.enemy("Stable of Horseflies");
				break;
				case 16:this.battleReport.enemy("Colony of Ants");
				break;
				case 8:this.battleReport.enemy("Centipede Gladiator");
				break;
				case 7:this.battleReport.enemy("Praying Mantis Assassin");
				break;
				case 15:this.battleReport.enemy("Army of Crickets");
				break;
				case 14:this.battleReport.enemy("Lair of Leeches");
				break;
				case 13:this.battleReport.enemy("Scourge of Mosquitoes")
			}
			this.battleReport.enemy("Level "+o+" "+this.battleReport.enemy());
			c=o;
			switch(this.nation.custom)
				{
				case 4:f=f*2;
				u=u/1.2;
				n=n/1.2;
				t=t/1.2;
				r=r/1.2;
				i=i/1.2;
				break;
				case 1:n=n*1.3;
				r=r*1.3;
				t=t/1.3;
				i=i/1.3;
				break;
				case 2:n=n/1.3;
				r=r/1.3;
				i=i*1.3;
				t=t*1.3;
				break;
				case 5:u=u*.7*f;
				n=n*.7*f;
				t=t*.7*f;
				r=r*.7*f;
				i=i*.7*f;
				f=1;
				c=Math.round(c*f);
				break;
				case 3:u=u*2;
				n=n*.75;
				t=t*.75
			}
			for(this.enemyArmyMound.removeAll(),l=1;
			l<=f;
			l++)e=new Critter(s,-l,CoinFlip()?1:0),e.job=4,e.traits[0].base=SmartRound(RandomInRange(u-StatVariance(u),u+StatVariance(u))),e.traits[1].base=SmartRound(RandomInRange(r-StatVariance(r),r+StatVariance(r))),e.traits[2].base=SmartRound(RandomInRange(i-StatVariance(i),i+StatVariance(i))),e.traits[3].base=SmartRound(RandomInRange(n-StatVariance(n),n+StatVariance(n))),e.traits[4].base=SmartRound(RandomInRange(t-StatVariance(t),t+StatVariance(t))),e.experience(c),e.CalculateScore(),this.enemyArmyMound.push(e)
		}
	}
	,n.prototype.Generate=function(n,t)
		{
		var o,f,s,a,h,c,r,u,i,e,l;
		for(this.tiles.removeAll(),o=0,f=0;
		f<t;
		f++)
			{
			for(s=ko.observableArray(),u=0;
			u<n;
			u++)a=new GameMapTile(new Point(u,f)),s.push(a),o++;
			this.tiles.push(s)
		}
		if(this.tileCount(o),h=new Point(RandomInRange(4,n-4),3),c=new Point(RandomInRange(4,n-4),t-3),CoinFlip()?(this.mound=h,this.enemy=c):(this.mound=c,this.enemy=h),r=[],r.push(this.mound),r.push(this.enemy),!this.nation.mineFound())for(i=!1;
		!i;
		)(this.mine=new Point(RandomInRange(2,n-3),RandomInRange(2,t-3)),this.LocationTaken(this.mine,r,5))||(i=!0,r.push(this.mine));
		if(!this.nation.farmFound())for(i=!1;
		!i;
		)(this.farm=new Point(RandomInRange(2,n-3),RandomInRange(2,t-3)),this.LocationTaken(this.farm,r,5))||(i=!0,r.push(this.farm));
		if(!this.nation.carryFound())for(i=!1;
		!i;
		)(this.carry=new Point(RandomInRange(2,n-3),RandomInRange(2,t-3)),this.LocationTaken(this.carry,r,5))||(i=!0,r.push(this.carry));
		if(!this.nation.factoryFound())for(i=!1;
		!i;
		)(this.factory=new Point(RandomInRange(2,n-3),RandomInRange(2,t-3)),this.LocationTaken(this.factory,r,5))||(i=!0,r.push(this.factory));
		if(!this.nation.geneFound())for(i=!1;
		!i;
		)(this.gene=new Point(RandomInRange(0,n-1),RandomInRange(0,t-1)),this.LocationTaken(this.gene,r,5))||(i=!0,r.push(this.gene));
		if(!this.nation.boostFound())for(i=!1;
		!i;
		)(this.boost=new Point(RandomInRange(1,n-2),RandomInRange(1,t-2)),this.LocationTaken(this.boost,r,5))||(i=!0,r.push(this.boost));
		if(!this.nation.fortFound())for(i=!1;
		!i;
		)(this.fort=new Point(RandomInRange(1,n-2),RandomInRange(1,t-2)),this.LocationTaken(this.fort,r,5))||(i=!0,r.push(this.fort));
		if(!this.nation.exploreFound())for(i=!1;
		!i;
		)(this.explore=new Point(RandomInRange(1,n-2),RandomInRange(1,t-2)),this.LocationTaken(this.explore,r,5))||(i=!0,r.push(this.explore));
		for(u=0;
		u<4;
		u++)for(i=!1;
		!i;
		)(e=new Point(RandomInRange(0,n-1),RandomInRange(0,t-1)),this.LocationTaken(e,r,4))||(r.push(e),this.treasures.push(e),i=!0);
		l=this.GetTile(this.mound);
		l.isUnlocked(!0);
		l.danger(0);
		this.currentBattle=this.mound;
		this.Clear()
	}
	,n
}
(),MapItem;
(function(n)
	{
	n[n.Enemy=0]="Enemy";
	n[n.Mine=1]="Mine";
	n[n.Farm=2]="Farm";
	n[n.Carrier=3]="Carrier";
	n[n.Factory=4]="Factory";
	n[n.Treasure=5]="Treasure";
	n[n.Gene=6]="Gene";
	n[n.Boost=7]="Boost";
	n[n.Explore=8]="Explore";
	n[n.Fort=9]="Fort"
}
)(MapItem||(MapItem=
	{
}
));
var BattleMoundIndex=function()
	{
	function n(n,t,i,r)
		{
		this.id=n;
		this.isPlayer=t;
		this.index=i;
		this.speed=r
	}
	return n
}
(),Nation=function()
	{
	function n(n,t,i,r,u,f,e,o,s)
		{
		this.isUnlocked=ko.observable(!1);
		this.mineFound=ko.observable(!1);
		this.farmFound=ko.observable(!1);
		this.carryFound=ko.observable(!1);
		this.factoryFound=ko.observable(!1);
		this.exploreFound=ko.observable(!1);
		this.fortFound=ko.observable(!1);
		this.geneFound=ko.observable(!1);
		this.boostFound=ko.observable(!1);
		this.treasuresFound=ko.observable(0);
		this.mapComplete=ko.observable(!1);
		this.isDefeated=ko.observable();
		this.enemy=n;
		this.custom=t;
		this.name=i;
		this.desc=r;
		this.isUnlocked(!1);
		this.lowBaseValue=u;
		this.highBaseValue=f;
		this.armySizeBase=e;
		this.requiredToUnlock=o;
		this.treasurePoints=s
	}
	return n
}
(),availableGenes=[new Gene(0,0,1,"Limb Regen",0,!0),new Gene(1,0,1,"Biologic Immortal",0,!0),new Gene(2,0,1,"Fast Clotting",0,!0),new Gene(3,0,1,"High Metabolism",0,!0),new Gene(4,0,1,"Reduced Aging",0,!0),new Gene(5,0,1,"Hardened Carapace",0,!0),new Gene(6,0,1,"Vigorous",0,!0),new Gene(7,0,1,"Redundant Organs",0,!0),new Gene(8,0,1,"Exoskeleton",0,!0),new Gene(9,0,1,"Carapace Regen",0,!0),new Gene(10,0,1,"Iron Skin",0,!0),new Gene(11,0,1,"Detachable Tail",0,!0),new Gene(12,0,1,"Ancient Blood",0,!0),new Gene(13,0,1,"Lucky",0,!0),new Gene(14,0,1,"Guardian Angel",0,!0),new Gene(15,0,1,"Replaceable Organs",0,!0),new Gene(100,1,1,"Big Boned",0,!0),new Gene(101,1,1,"Gigantism",0,!0),new Gene(102,1,1,"Increased Mass",0,!0),new Gene(103,1,1,"Berserk Instinct",0,!0),new Gene(104,1,1,"Elastic Tendons",0,!0),new Gene(105,1,1,"Adrenal Glands",0,!0),new Gene(106,1,1,"Tireless",0,!0),new Gene(107,1,1,"Fast Recovery",0,!0),new Gene(108,1,1,"Pain Tolerance",0,!0),new Gene(109,1,1,"Fast Twitch",0,!0),new Gene(110,1,1,"Early Puberty",0,!0),new Gene(111,1,1,"Badassery",0,!0),new Gene(112,1,1,"Iron Bones",0,!0),new Gene(113,1,1,"Gamma Irradiated",0,!0),new Gene(114,1,1,"Warrior Ancestry",0,!0),new Gene(115,1,1,"Strong Grip",0,!0),new Gene(200,3,1,"Fanged",0,!0),new Gene(201,3,1,"Razor Teeth",0,!0),new Gene(202,3,1,"Infectious Bite",0,!0),new Gene(203,3,1,"Pinchers",0,!0),new Gene(204,3,1,"Carnivorous",0,!0),new Gene(205,3,1,"Mandibles",0,!0),new Gene(206,3,1,"Unhingable Jaw",0,!0),new Gene(207,3,1,"Bacterial Spit",0,!0),new Gene(208,3,1,"Serrated Teeth",0,!0),new Gene(209,3,1,"Replaceable Teeth",0,!0),new Gene(210,3,1,"Long Snout",0,!0),new Gene(211,3,1,"Hooked Teeth",0,!0),new Gene(212,3,1,"Locking Jaw",0,!0),new Gene(213,3,1,"Prehensile Tongue",0,!0),new Gene(214,3,1,"Whip Tongue",0,!0),new Gene(215,3,1,"Iron Teeth",0,!0),new Gene(300,4,1,"Prehensile Tail",0,!0),new Gene(301,4,1,"Barbed Tail",0,!0),new Gene(302,4,1,"Paralyzing Venom",0,!0),new Gene(303,4,1,"Long Tail",0,!0),new Gene(304,4,1,"Double Tails",0,!0),new Gene(305,4,1,"Forked Stinger",0,!0),new Gene(306,4,1,"Hallucinogenic Venom",0,!0),new Gene(307,4,1,"Decoagulant Venom",0,!0),new Gene(308,4,1,"Acidic Venom",0,!0),new Gene(309,4,1,"Whip Tail",0,!0),new Gene(310,4,1,"Projectile Barbs",0,!0),new Gene(311,4,1,"Iron Barb",0,!0),new Gene(312,4,1,"Tail Slash",0,!0),new Gene(313,4,1,"Lightning Strike",0,!0),new Gene(314,4,1,"Tail Regrowth",0,!0),new Gene(315,4,1,"Seeking Sting",0,!0),new Gene(400,2,1,"Hyperactive",0,!0),new Gene(401,2,1,"Instinctive",0,!0),new Gene(402,2,1,"Sticky Feet",0,!0),new Gene(403,2,1,"Precognitive",0,!0),new Gene(404,2,1,"Tactile",0,!0),new Gene(405,2,1,"Peripheral Vision",0,!0),new Gene(406,2,1,"Alert",0,!0),new Gene(407,2,1,"Good Balance",0,!0),new Gene(408,2,1,"Winged",0,!0),new Gene(409,2,1,"Finned",0,!0),new Gene(410,2,1,"Radial Movement",0,!0),new Gene(411,2,1,"Segmented Legs",0,!0),new Gene(410,2,1,"Compound Eyes",0,!0),new Gene(411,2,1,"Nimble",0,!0),new Gene(412,2,1,"Dodge",0,!0),new Gene(413,2,1,"High Jumper",0,!0),new Gene(414,2,1,"Clawed Feet",0,!0),new Gene(415,2,1,"Stealth",0,!0)],enemyGenes=[[new Gene(900,2,1,"Gnat Agility",0,!0)],[new Gene(905,2,1,"Ladybug Agility",0,!0)],[new Gene(910,2,1,"Chigger Agility",0,!0)],[new Gene(915,4,1,"Wasp Sting",0,!0)],[new Gene(920,4,1,"Scorpion Sting",0,!0)],[new Gene(925,4,1,"Bee Sting",0,!0)],[new Gene(930,3,1,"Tarantula Bite",0,!0)],[new Gene(935,2,1,"Praying Mantis Agility",0,!0),new Gene(937,1,1,"Praying Mantis Strength",0,!0)],[new Gene(940,0,1,"Centipede Vitality",0,!0),new Gene(941,4,1,"Centipede Sting",0,!0)],[new Gene(945,3,1,"Beetle Bite",0,!0)],[new Gene(950,3,1,"Horsefly Bite",0,!0)],[new Gene(955,3,1,"Termite Bite",0,!0)],[new Gene(960,0,1,"Tick Vitality",0,!0)],[new Gene(965,0,1,"Mosquito Vitality",0,!0)],[new Gene(970,0,1,"Leech Vitality",0,!0)],[new Gene(975,1,1,"Cricket Strength",0,!0)],[new Gene(980,1,1,"Ant Strength",0,!0)],[new Gene(985,1,1,"Grasshopper Strength",0,!0)]],TraitType;
(function(n)
	{
	n[n.Vitality=0]="Vitality";
	n[n.Strength=1]="Strength";
	n[n.Agility=2]="Agility";
	n[n.Bite=3]="Bite";
	n[n.Sting=4]="Sting"
}
)(TraitType||(TraitType=
	{
}
)),function(n)
	{
	n[n.Female=0]="Female";
	n[n.Male=1]="Male"
}
(GenderType||(GenderType=
	{
}
)),function(n)
	{
	n[n.None=0]="None";
	n[n.Recessive=1]="Recessive";
	n[n.Dominant=2]="Dominant"
}
(ExpressionType||(ExpressionType=
	{
}
)),function(n)
	{
	n[n.Mating=0]="Mating";
	n[n.Mound=1]="Mound";
	n[n.Worker=2]="Worker";
	n[n.Army=3]="Army";
	n[n.Enemy=4]="Enemy";
	n[n.HeirMound=5]="HeirMound"
}
(JobType||(JobType=
	{
}
)),function(n)
	{
	n[n.Balanced=0]="Balanced";
	n[n.Bite=1]="Bite";
	n[n.Sting=2]="Sting";
	n[n.Health=3]="Health";
	n[n.HighNumbers=4]="HighNumbers";
	n[n.Single=5]="Single"
}
(EnemyCustomType||(EnemyCustomType=
	{
}
)),function(n)
	{
	n[n.Gnat=0]="Gnat";
	n[n.Ladybug=1]="Ladybug";
	n[n.Chigger=2]="Chigger";
	n[n.Wasp=3]="Wasp";
	n[n.Scorpion=4]="Scorpion";
	n[n.Bee=5]="Bee";
	n[n.Tarantula=6]="Tarantula";
	n[n.PrayingMantis=7]="PrayingMantis";
	n[n.Centipede=8]="Centipede";
	n[n.Beetle=9]="Beetle";
	n[n.Horsefly=10]="Horsefly";
	n[n.Termite=11]="Termite";
	n[n.Tick=12]="Tick";
	n[n.Mosquito=13]="Mosquito";
	n[n.Leech=14]="Leech";
	n[n.Cricket=15]="Cricket";
	n[n.Ant=16]="Ant";
	n[n.Grasshopper=17]="Grasshopper"
}
(EnemyType||(EnemyType=
	{
}
));
$(document).ready(function()
	{
	game=new GameController;
	game.Load(null);
	ko.applyBindings(game);
	Shuffle(availableGenes);
	$.notify.defaults(
		{
		clickToHide:!0,autoHide:!0,autoHideDelay:4e3,globalPosition:"bottom right",elementPosition:"top right",gap:4,arrowShow:!1,arrowSize:5,style:"bootstrap",className:"error",showAnimation:"slideDown",showDuration:400,hideAnimation:"slideUp",hideDuration:200
	}
	);
	var n=new Worker("Scripts/Worker.js");
	n.onmessage=function()
		{
		game.Tick()
	}
}
);
