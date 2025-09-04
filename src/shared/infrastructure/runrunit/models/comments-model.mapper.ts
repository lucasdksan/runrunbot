export type CommentProps = {
    id: number;
    user_id: string;
    commenter_name: string;
    is_system_message: boolean;
    media: any[];
    text: string;
};

export class RunrunitCommentsMapper {
    static toCommentArray(external: any[]): CommentProps[] {
        const filteredComment = external.filter((comment) => !comment.is_system_message).slice().reverse();
        const formattedComment: CommentProps[] = filteredComment.map((comment) => ({
            id: comment.id,
            commenter_name: comment.commenter_name,
            is_system_message: comment.is_system_message,
            media: comment.media,
            text: comment.text,
            user_id: comment.user_id,
        }));

        return formattedComment;
    }
}