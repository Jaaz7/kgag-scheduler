import type * as Types from './schema.types';

export type UsersSelectQueryVariables = Types.Exact<{
  filter: Types.UserFilter;
  sorting?: Types.InputMaybe<Array<Types.UserSort> | Types.UserSort>;
  paging: Types.OffsetPaging;
}>;


export type UsersSelectQuery = { users: (
    Pick<Types.UserConnection, 'totalCount'>
    & { nodes: Array<Pick<Types.User, 'id' | 'name' | 'avatarUrl'>> }
  ) };

export type TaskStagesSelectQueryVariables = Types.Exact<{
  filter: Types.TaskStageFilter;
  sorting?: Types.InputMaybe<Array<Types.TaskStageSort> | Types.TaskStageSort>;
  paging: Types.OffsetPaging;
}>;


export type TaskStagesSelectQuery = { taskStages: (
    Pick<Types.TaskStageConnection, 'totalCount'>
    & { nodes: Array<Pick<Types.TaskStage, 'id' | 'title'>> }
  ) };
