const CommentList = ({ comments }) => {
    const renderedComments = comments.map((comment) => {
        let content;
        if ('approved' === comment.status) {
            content = comment.content;
        }
        if ('pending' === comment.status) {
            content = 'This Comment is awaiting for moderation';
        }
        if ('rejected' === comment.status) {
            content = 'This Comment is rejected';
        }
        return <li key={comment.id}>{content}</li>;
    });
    return <ul>{renderedComments}</ul>;
};

export default CommentList;
