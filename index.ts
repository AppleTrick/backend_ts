import { DataSource } from "typeorm";
import { Board } from "./Board.postgres";
import { ApolloServer, gql } from "apollo-server";

// Docs
const typeDefs = gql`
  # 다 똑같은 타입이지만 graphql 에서는 input에 들어가는 타입은 별도로 구별한다.
  input CreateBoardInput {
    writer: String
    title: String
    contents: String
  }

  type MyBoard {
    number: Int
    writer: String
    title: String
    contents: String
  }

  type Query {
    fetchBoards: [MyBoard]
  }

  type Mutation {
    # 연습용 (example 방식)
    # reateBoard(writer: String , title: String, contents: String): String

    # 실무용 (Backend 방식)
    createBoard(createBoardInput: CreateBoardInput!): String
  }
`;

// API
const resolvers = {
  Query: {
    fetchBoards: async () => {
      // 모두 꺼내기
      const result = await Board.find();

      // 하나만 골라서 꺼내기
      // Board.findOne({where : {number : 3}});
      return result; // [{number : 1 , writer : "철수" , title : "안녕하세요" , contents : "반갑습니다."} ,{} ,{}]
    },
  },

  Mutation: {
    // example용

    // createBoard: async (parent, args, context, info) => {
    //   await Board.insert({
    //     writer : args.writer,
    //     title : args.title,
    //     contents : args.contents,
    //   });
    //   return "게시글 등록에 성공하였습니다.";
    // },

    createBoard: async (parent : any , args : any , context: any, info : any) => {
      // context : request, header 등에 대한 정보
      // info : graphql 에 대한 정보
      // parent : api에서 api를 호출 할때는 인자가 parent 로 들어가게 된다.
      
      await Board.insert({
        // 1. spread 연산자 이용하여 처리하는 방법
        ...args.createBoardInput,

        // 2. 하나하나 모두 입력하는 방법
        // writer : args.createBoardInput.writer,
        // title : args.createBoardInput.title,
        // contents : args.createBoardInput.contents,
      });
      return "게시글 등록에 성공하였습니다.";
    },

    // updateBoard : async () => {
    //   // 처음인자가 조건
    //   // 두번째가 바뀌게 될것
    //   await Board.update({ number: 3}, { writer : "영희"}); // => 3번 게시글의 작성자를 영희로 바꿔줘
    //   return "게시글 수정에 성공하였습니다."
    // },

    // deleteBoard : async () => {
    //   await Board.delete({number : 3}); // => 3번 게시글을 삭제해줘
    //   // await Board.update({number : 3} , {isDeleted : true}) // 현업에서는 DB추적을 위해 실제로 삭제하지 않고 isDeleted라는 컬럼이 true 이면 삭제되었다고 가정
    //   // await Board.update({number : 3} , {deletedAt : new Date()}) // => deletedAt이 null 이면 삭제 안되 게시글 , new Date() 시간이 들어가 있으면 그 시간에 삭제된 게시글
    //   return "게시글 삭제에 성공하였습니다."
    // }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // cors 처리해주는 방법
  cors: true,
  // 선택한 사이트만 풀어주고 싶을때
  // cors: {
  //   origin: ["http://naver.com"],
  // },
});

const AppDataSource = new DataSource({
  type: "postgres",
  host: "34.64.124.242",
  port: 5050,
  username: "postgres",
  password: "postgres2022",
  database: "postgres",
  synchronize: true,
  logging: true,
  entities: [Board],
});

AppDataSource.initialize()
  .then(() => {
    console.log("DB접속에 성공했습니다.");

    // DB연결까지 모두 끝나고 가장 마지막에 실행, 다른사람의 접속을 기다리기 위함
    server.listen(4000).then(({ url }) => {
      console.log(`🚀 서버가 ${url} 에서 실행중입니다.`);
    });
  })
  .catch((error) => {
    console.log("DB접속에 실패했습니다.");
    console.log(error);
  });

server.listen(4000).then(({ url }) => {
  console.log(`🚀 서버가 ${url} 에서 실행중입니다.`);
});
