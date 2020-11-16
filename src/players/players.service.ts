import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/createPlayer.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  private readonly logger = new Logger(PlayersService.name);

  async createUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { email } = createPlayerDto;

    // const playerFound = await this.players.find(
    //   (player) => player.email === email,
    // );

    const playerFound = await this.playerModel.findOne({ email }).exec();

    if (playerFound) {
      return this.updatePlayer(playerFound, createPlayerDto);
    } else {
      await this.create(createPlayerDto);
    }
  }

  async getAllPlayers(): Promise<Player[]> {
    // return await this.players;
    return await this.playerModel.find().exec();
  }

  async getPlayerByEmail(email: string): Promise<Player> {
    const playerFound = await this.playerModel.findOne({ email }).exec();

    if (!playerFound) {
      throw new NotFoundException(
        `Jogador com e-mail ${email} não encontrado.`,
      );
    }

    return playerFound;
  }

  async deletePlayerByEmail(email: string): Promise<any> {
    return await this.playerModel.remove({ email }).exec();
    // const playerFound = await this.players.find(
    //   (player) => player.email === email,
    // );

    // if (!playerFound) {
    //   throw new NotFoundException(
    //     `Jogador com e-mail ${email} não encontrado.`,
    //   );
    // }

    // this.players = this.players.filter(
    //   (player) => player.email !== playerFound.email,
    // );
  }

  private async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const playerCreated = new this.playerModel(createPlayerDto);

    return await playerCreated.save();

    // const { name, email, phoneNumber } = createPlayerDto;

    // const player: Player = {
    //   _id: uuidv4(),
    //   name,
    //   email,
    //   phoneNumber,
    //   ranking: 'A',
    //   rankingPosition: 1,
    //   urlPhoto:
    //     'https://image.freepik.com/vetores-gratis/icone-de-avatar-de-personagem-de-homem-esporte-de-tenis_51635-2515.jpg',
    // };
    // this.logger.log(`createPlayerDto: ${JSON.stringify(player)}`);
    // this.players.push(player);
  }

  private async updatePlayer(
    playerFound: Player,
    createPlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    return await this.playerModel
      .findOneAndUpdate(
        { email: createPlayerDto.email },
        { $set: createPlayerDto },
      )
      .exec();
    // const { name } = createPlayerDto;

    // playerFound.name = name;
  }
}
