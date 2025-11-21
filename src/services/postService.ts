import api from './api'

export type PostStatus = 'draft' | 'published' | 'archived'

export type Post = {
  id: string
  title: string
  status: PostStatus
  excerpt: string
  content?: string
}

const fallbackPosts: Post[] = [
  { id: '1', title: 'Ejemplo 1', status: 'published', excerpt: 'Primer post de ejemplo' },
  { id: '2', title: 'Ejemplo 2', status: 'draft', excerpt: 'Segundo post de ejemplo' },
]

export async function getPosts(params: Record<string, unknown> = {}): Promise<Post[]> {
  try {
    const { data } = await api.get<Post[]>('/posts', { params })
    return data
  } catch (error) {
    console.warn('Usando posts locales por error en la API', error)
    return fallbackPosts
  }
}

export async function getPostById(postId: string): Promise<Post> {
  const { data } = await api.get<Post>(`/posts/${postId}`)
  return data
}

export async function createPost(payload: Partial<Post>): Promise<Post> {
  const { data } = await api.post<Post>('/posts', payload)
  return data
}
