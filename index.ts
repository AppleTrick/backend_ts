import { DataSource } from "typeorm";
import { Board } from "./Board.postgres";
import { ApolloServer, gql } from "apollo-server";

// Docs
const typeDefs = gql`
  type Query {
    fetchBoards: String
  }

  type Mutation {
    createBoard: String
  }
`;

// API
const resolvers = {
  Query: {
    fetchBoards: () => {
      return "게시글 조회에 성공하였습니다.";
    },
  },

  Mutation: {
    createBoard: () => {
      return "게시글 등록에 성공하였습니다.";
    },
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
