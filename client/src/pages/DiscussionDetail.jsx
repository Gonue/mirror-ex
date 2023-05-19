import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import PageContainer from "../components/common/PageContainer.jsx";
import CustomButton from "../components/common/CustomButton.jsx";
import Comment from "../components/common/Comment.jsx";
import { getData, updateData } from "../api/apiUtil.js";
import useModal from "../hooks/useModal.js";
import Dialog from "../components/common/Dialog.jsx";

export default function DiscussionDetail() {
  const [body, setBody] = useState([]);
  const [commentBody, setCommentBody] = useState([]);
  const [comment, setComment] = useState("");
  const { id } = useParams();
  const [dialog, openDialog, closeDialog] = useModal();

  let data = { content: `<p>${comment}</p>` };
  function CreactComment() {
    updateData(data, `/article/${id}/articleComments`, "post")
      .then(res => {
        console.log(res);
        setComment("");
        window.location.reload();
      })
      .catch(err => {
        console.error(err);
      });
  }
  function DeleteComment(articleCommentId) {
    updateData(
      data,
      `/article/${id}/articleComments/${articleCommentId}`,
      "Delete"
    )
      .then(res => {
        console.log(res);
        setComment("");
        window.location.reload();
      })
      .catch(err => {
        console.error(err);
      });
  }
  useEffect(() => {
    getData(`article/${id}`)
      .then(data => {
        setBody(data.result);
      })
      .catch(error => {
        console.error(error);
      });
    getData(`article/${id}/articleComments`)
      .then(data => {
        setCommentBody(data.result.content);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <PageContainer>
      <h2>Discussion</h2>
      <Bar>
        <CustomButton
          text="토론글 수정"
          feat="round"
          reverse="true"
          path={`/admin/edit/article/${id}`}
          item={body}
        />
        <CustomButton text="토론글 삭제" feat="round" onClick={openDialog} />
        {dialog && (
          <Dialog
            feat="삭제하기"
            path={`/article/${id}`}
            // path={quizDeletePath}
            text={["토론글을 삭제하시겠습니까?"]}
            closeDialog={closeDialog}
          />
        )}
      </Bar>
      <Subject>
        <span dangerouslySetInnerHTML={{ __html: body.title }} />
        <span dangerouslySetInnerHTML={{ __html: body.content }} />
      </Subject>
      {/* 탭으로 만들어야한다. 누르면 색깔 변하게 */}
      <CommitBar>
        <div>댓글 {body.commentCount}</div>
        <button>등록순</button>
        <button>최신순</button>
        <button>추천순</button>
      </CommitBar>
      <Comments>
        {commentBody.map(item => {
          return (
            <Comment
              commentBody={item}
              profile="true"
              feat="tool"
              key={item.articleCommentId}
              DeleteComment={DeleteComment}
            />
          );
        })}

        <CommentInput>
          <textarea
            maxLength="200"
            placeholder="댓글을 입력하세요."
            type="text"
            onInput={e => {
              setComment(e.target.value);
            }}></textarea>
          <button onClick={CreactComment}>댓글등록</button>
        </CommentInput>
      </Comments>
      <MoveList>
        <CustomButton text="목록보기" feat="round" path="/discussion" />
      </MoveList>
    </PageContainer>
  );
}
const Bar = styled.div`
  display: flex;
  & > :nth-child(1) {
    margin-right: 15px;
  }
`;

const Subject = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.color.white};
  margin: 30px 0px;
  border-radius: 10px;
  border: solid 1px ${({ theme }) => theme.color.black};

  & > :nth-child(1) {
    padding: 30px;
    height: 100px;
  }

  & > :nth-child(2) {
    border-top: solid 1px ${({ theme }) => theme.color.black};
    padding: 30px;
    min-height: 150px;
    word-break: break-all;
  }
`;

const CommitBar = styled.div`
  display: flex;

  div {
    margin-right: 20px;
  }
  & > :nth-child(3) {
    ::before {
      content: "";
      display: inline-block;
      width: 10px;
      height: 8px;
      margin-right: 10px;
      border-right: 1px solid ${props => props.theme.color.gray100};
    }
    ::after {
      content: "";
      display: inline-block;
      width: 10px;
      height: 8px;
      margin-right: 10px;
      border-right: 1px solid ${props => props.theme.color.gray100};
    }
  }
`;

const Comments = styled.div`
  margin-top: 15px;
  margin-bottom: 50px;
  border-radius: 10px;
  border: solid 1px ${({ theme }) => theme.color.gray100};
  background-color: ${({ theme }) => theme.color.white};
`;

const CommentInput = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 30px;
  margin: 30px;
  padding: 20px;
  border: solid 1px ${({ theme }) => theme.color.gray100};
  border-radius: 10px;
  textarea {
    width: 100%;
    border: none;
    resize: none;
    overflow: hidden;
    :focus {
      outline: none;
    }
  }
  button {
    color: ${({ theme }) => theme.color.mainHover};
    text-align: right;
  }
`;

const MoveList = styled.div`
  text-align: right;
`;
