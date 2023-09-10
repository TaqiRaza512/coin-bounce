import styles from "./CommentList.module.css";
import Comment from "../Comment/Comment";

function CommentList({ comments }) {
  if(comments.Comments)
  {
    comments=comments.Comments;
  }
  return (
    <div className={styles.CommentListWrapper}>
      {comments.length === 0 ? 
        <div className={styles.noComments}> No comments posted</div>
       : 
       <div className={styles.commentList}>
        {comments.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
        </div>
      }
    </div>
  );
}
export default CommentList;