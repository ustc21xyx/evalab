-- =============================================
-- AI 评测打分系统 - Supabase 数据库表结构
-- =============================================

-- 启用 UUID 扩展
create extension if not exists "uuid-ossp";

-- =============================================
-- 1. 题目分类表 (categories)
-- =============================================
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name varchar(100) not null unique,
  description text,
  color varchar(7) default '#8B7355', -- 用于 UI 展示的颜色
  sort_order integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 插入默认分类
insert into categories (name, description, color, sort_order) values
  ('逻辑推理', '测试 AI 的逻辑分析和推理能力', '#8B7355', 1),
  ('代码能力', '测试 AI 的编程和代码理解能力', '#6B8E6B', 2),
  ('创意写作', '测试 AI 的创意和文字表达能力', '#B8860B', 3),
  ('知识问答', '测试 AI 的知识储备和准确性', '#708090', 4),
  ('数学计算', '测试 AI 的数学运算能力', '#CD853F', 5);

-- =============================================
-- 2. 题目表 (questions)
-- =============================================
create table questions (
  id uuid primary key default uuid_generate_v4(),
  title varchar(500) not null,
  content text not null,
  category_id uuid references categories(id) on delete set null,
  difficulty integer check (difficulty >= 1 and difficulty <= 5) default 3, -- 难度 1-5
  expected_answer text, -- 参考答案（可选）
  tags text[], -- 标签数组
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 创建索引
create index idx_questions_category on questions(category_id);
create index idx_questions_difficulty on questions(difficulty);
create index idx_questions_is_active on questions(is_active);

-- =============================================
-- 3. AI 模型表 (models)
-- =============================================
create table models (
  id uuid primary key default uuid_generate_v4(),
  name varchar(100) not null unique,
  provider varchar(100), -- 提供商（如 OpenAI, Anthropic, Google 等）
  version varchar(50), -- 版本号
  description text,
  api_identifier varchar(200), -- API 调用标识（如 gpt-4, claude-3-opus）
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 插入一些常见模型作为示例
insert into models (name, provider, version, api_identifier) values
  ('GPT-4o', 'OpenAI', '2024', 'gpt-4o'),
  ('GPT-4o mini', 'OpenAI', '2024', 'gpt-4o-mini'),
  ('Claude 3.5 Sonnet', 'Anthropic', '2024', 'claude-3-5-sonnet'),
  ('Claude 3 Opus', 'Anthropic', '2024', 'claude-3-opus'),
  ('Gemini Pro', 'Google', '1.5', 'gemini-1.5-pro');

-- 创建索引
create index idx_models_provider on models(provider);
create index idx_models_is_active on models(is_active);

-- =============================================
-- 4. 评分维度表 (scoring_dimensions)
-- 支持自定义评分维度
-- =============================================
create table scoring_dimensions (
  id uuid primary key default uuid_generate_v4(),
  name varchar(100) not null unique,
  description text,
  max_score integer default 10 check (max_score > 0),
  weight decimal(3,2) default 1.0 check (weight > 0), -- 权重
  is_default boolean default false, -- 是否为默认维度
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

-- 插入默认评分维度
insert into scoring_dimensions (name, description, max_score, weight, is_default, sort_order) values
  ('准确性', '回答的准确程度和正确性', 10, 1.0, true, 1),
  ('完整性', '回答是否全面完整', 10, 0.8, true, 2),
  ('清晰度', '表达是否清晰易懂', 10, 0.7, true, 3),
  ('创造性', '回答的创新性和独特见解', 10, 0.5, false, 4);

-- =============================================
-- 5. 评测记录表 (evaluations)
-- 核心表：记录每次评测
-- =============================================
create table evaluations (
  id uuid primary key default uuid_generate_v4(),
  question_id uuid not null references questions(id) on delete cascade,
  model_id uuid not null references models(id) on delete cascade,
  answer text not null, -- AI 模型的回答
  total_score decimal(5,2) check (total_score >= 0), -- 总分
  notes text, -- 评语/备注
  evaluated_by varchar(100), -- 评测人
  evaluated_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 创建索引
create index idx_evaluations_question on evaluations(question_id);
create index idx_evaluations_model on evaluations(model_id);
create index idx_evaluations_evaluated_at on evaluations(evaluated_at);

-- 创建唯一约束：同一题目同一模型可以有多次评测，但需要不同时间
-- 如果需要限制每个模型每道题只能有一次评测，取消下面的注释：
-- create unique index idx_evaluations_unique on evaluations(question_id, model_id);

-- =============================================
-- 6. 评测详细分数表 (evaluation_scores)
-- 记录每个评分维度的具体分数
-- =============================================
create table evaluation_scores (
  id uuid primary key default uuid_generate_v4(),
  evaluation_id uuid not null references evaluations(id) on delete cascade,
  dimension_id uuid not null references scoring_dimensions(id) on delete cascade,
  score decimal(5,2) not null check (score >= 0),
  comment text, -- 针对该维度的评语
  created_at timestamp with time zone default now()
);

-- 创建索引
create index idx_evaluation_scores_evaluation on evaluation_scores(evaluation_id);
create index idx_evaluation_scores_dimension on evaluation_scores(dimension_id);

-- 确保每个评测的每个维度只有一个分数
create unique index idx_evaluation_scores_unique on evaluation_scores(evaluation_id, dimension_id);

-- =============================================
-- 7. 更新时间触发器
-- =============================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 为需要的表添加触发器
create trigger update_categories_updated_at
  before update on categories
  for each row execute function update_updated_at_column();

create trigger update_questions_updated_at
  before update on questions
  for each row execute function update_updated_at_column();

create trigger update_models_updated_at
  before update on models
  for each row execute function update_updated_at_column();

create trigger update_evaluations_updated_at
  before update on evaluations
  for each row execute function update_updated_at_column();

-- =============================================
-- 8. 常用视图
-- =============================================

-- 评测统计视图：按模型统计
create view model_statistics as
select
  m.id as model_id,
  m.name as model_name,
  m.provider,
  count(e.id) as total_evaluations,
  round(avg(e.total_score), 2) as avg_score,
  round(min(e.total_score), 2) as min_score,
  round(max(e.total_score), 2) as max_score
from models m
left join evaluations e on m.id = e.model_id
group by m.id, m.name, m.provider;

-- 评测统计视图：按分类统计
create view category_statistics as
select
  c.id as category_id,
  c.name as category_name,
  m.id as model_id,
  m.name as model_name,
  count(e.id) as total_evaluations,
  round(avg(e.total_score), 2) as avg_score
from categories c
cross join models m
left join questions q on c.id = q.category_id
left join evaluations e on q.id = e.question_id and m.id = e.model_id
group by c.id, c.name, m.id, m.name;

-- 详细评测视图
create view evaluation_details as
select
  e.id as evaluation_id,
  e.answer,
  e.total_score,
  e.notes,
  e.evaluated_by,
  e.evaluated_at,
  q.id as question_id,
  q.title as question_title,
  q.content as question_content,
  q.difficulty,
  c.id as category_id,
  c.name as category_name,
  m.id as model_id,
  m.name as model_name,
  m.provider
from evaluations e
join questions q on e.question_id = q.id
join models m on e.model_id = m.id
left join categories c on q.category_id = c.id;

-- =============================================
-- 9. Row Level Security (RLS) 策略
-- 如果需要用户认证，取消注释以下内容
-- =============================================

-- alter table categories enable row level security;
-- alter table questions enable row level security;
-- alter table models enable row level security;
-- alter table evaluations enable row level security;
-- alter table evaluation_scores enable row level security;
-- alter table scoring_dimensions enable row level security;

-- 示例策略：允许所有认证用户读取
-- create policy "Allow authenticated read" on categories
--   for select using (auth.role() = 'authenticated');

-- =============================================
-- 完成
-- =============================================
